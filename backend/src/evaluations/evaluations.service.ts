import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateEvaluationDto } from './dto/create-evaluation.dto.js';
import type { UpdateEvaluationDto } from './dto/update-evaluation.dto.js';
import type { CreateQuestionDto } from './dto/create-question.dto.js';
import type { UpdateQuestionDto } from './dto/update-question.dto.js';
import type { CreateReponseDto } from './dto/create-reponse.dto.js';
import type { UpdateReponseDto } from './dto/update-reponse.dto.js';

const INCLUDE_QUESTIONS_REPONSES = {
  questions: { include: { reponses: true }, orderBy: { id: 'asc' as const } },
};

@Injectable()
export class EvaluationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------- Evaluation ----------

  findAll(parcoursId?: number) {
    return this.prisma.evaluation.findMany({
      where: parcoursId ? { parcoursId } : undefined,
      include: { parcours: { select: { id: true, titre: true } }, _count: { select: { questions: true } } },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number, roleAppelant?: string) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id },
      include: INCLUDE_QUESTIONS_REPONSES,
    });
    if (!evaluation) {
      throw new NotFoundException(`Evaluation ${id} introuvable`);
    }

    // Un Collaborateur qui consulte l'evaluation pour la passer ne doit jamais recevoir
    // le flag estCorrecte : sinon la bonne reponse est visible dans la reponse HTTP
    // avant meme d'avoir repondu (fuite via les DevTools du navigateur).
    const estGestionnaire = roleAppelant === 'Manager' || roleAppelant === 'Responsable RH';
    if (!estGestionnaire) {
      return {
        ...evaluation,
        questions: evaluation.questions.map((question) => ({
          ...question,
          reponses: question.reponses.map(({ estCorrecte, ...reste }) => reste),
        })),
      };
    }

    return evaluation;
  }

  async create(dto: CreateEvaluationDto) {
    const parcours = await this.prisma.parcours.findUnique({ where: { id: dto.parcoursId } });
    if (!parcours) {
      throw new BadRequestException(`Le parcours ${dto.parcoursId} n'existe pas`);
    }
    return this.prisma.evaluation.create({ data: dto });
  }

  async update(id: number, dto: UpdateEvaluationDto) {
    await this.ensureEvaluationExists(id);
    return this.prisma.evaluation.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.ensureEvaluationExists(id);
    try {
      await this.prisma.evaluation.delete({ where: { id } });
      return { success: true };
    } catch (error) {
      throw this.mapForeignKeyError(error, 'evaluation', 'des questions ou des passages');
    }
  }

  // ---------- Question ----------

  async addQuestion(evaluationId: number, dto: CreateQuestionDto) {
    await this.ensureEvaluationExists(evaluationId);

    if (!dto.reponses.some((r) => r.estCorrecte)) {
      throw new BadRequestException('Au moins une reponse doit etre marquee correcte');
    }

    if (dto.competenceId) {
      const competence = await this.prisma.competence.findUnique({ where: { id: dto.competenceId } });
      if (!competence) {
        throw new BadRequestException(`La competence ${dto.competenceId} n'existe pas`);
      }
    }

    return this.prisma.question.create({
      data: {
        enonce: dto.enonce,
        points: dto.points,
        evaluationId,
        competenceId: dto.competenceId,
        reponses: { create: dto.reponses },
      },
      include: { reponses: true },
    });
  }

  async updateQuestion(questionId: number, dto: UpdateQuestionDto) {
    await this.ensureQuestionExists(questionId);
    return this.prisma.question.update({ where: { id: questionId }, data: dto });
  }

  async removeQuestion(questionId: number) {
    await this.ensureQuestionExists(questionId);
    // onDelete par defaut = Restrict : on supprime d'abord les reponses associees
    await this.prisma.reponse.deleteMany({ where: { questionId } });
    await this.prisma.question.delete({ where: { id: questionId } });
    return { success: true };
  }

  // ---------- Reponse ----------

  async addReponse(questionId: number, dto: CreateReponseDto) {
    await this.ensureQuestionExists(questionId);
    return this.prisma.reponse.create({ data: { ...dto, questionId } });
  }

  async updateReponse(reponseId: number, dto: UpdateReponseDto) {
    await this.ensureReponseExists(reponseId);
    return this.prisma.reponse.update({ where: { id: reponseId }, data: dto });
  }

  async removeReponse(reponseId: number) {
    const reponse = await this.prisma.reponse.findUnique({ where: { id: reponseId } });
    if (!reponse) {
      throw new NotFoundException(`Reponse ${reponseId} introuvable`);
    }
    const totalReponses = await this.prisma.reponse.count({ where: { questionId: reponse.questionId } });
    if (totalReponses <= 2) {
      throw new ConflictException('Une question doit garder au moins 2 reponses possibles');
    }
    await this.prisma.reponse.delete({ where: { id: reponseId } });
    return { success: true };
  }

  // ---------- Helpers ----------

  private async ensureEvaluationExists(id: number) {
    const exists = await this.prisma.evaluation.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException(`Evaluation ${id} introuvable`);
    }
  }

  private async ensureQuestionExists(id: number) {
    const exists = await this.prisma.question.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException(`Question ${id} introuvable`);
    }
  }

  private async ensureReponseExists(id: number) {
    const exists = await this.prisma.reponse.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException(`Reponse ${id} introuvable`);
    }
  }

  private mapForeignKeyError(error: unknown, entite: string, dependances: string) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return new ConflictException(
        `Impossible de supprimer cette ${entite} : elle contient encore ${dependances}.`,
      );
    }
    return error;
  }
}
