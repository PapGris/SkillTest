import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ROLES = ['Collaborateur', 'Manager', 'Responsable RH'];

const MOT_DE_PASSE_PAR_DEFAUT = 'password123';

const UTILISATEURS_DEMO = [
  { nom: 'Martin', prenom: 'Sophie', email: 'rh@skilltest.fr', role: 'Responsable RH' },
  { nom: 'Bernard', prenom: 'Thomas', email: 'manager@skilltest.fr', role: 'Manager' },
  { nom: 'Dupont', prenom: 'Julie', email: 'collaborateur@skilltest.fr', role: 'Collaborateur' },
];

const COMPETENCES_DEMO = [
  { nomCompetence: 'Angular', description: 'Framework front-end JavaScript/TypeScript' },
  { nomCompetence: 'NestJS', description: 'Framework back-end Node.js' },
  { nomCompetence: 'SQL', description: 'Bases de donnees relationnelles' },
  { nomCompetence: 'Docker', description: "Conteneurisation d'applications" },
  { nomCompetence: 'Git', description: 'Gestion de versions' },
];

async function main() {
  for (const nomRole of ROLES) {
    await prisma.role.upsert({ where: { nomRole }, update: {}, create: { nomRole } });
  }
  console.log(`Roles seedes : ${ROLES.join(', ')}`);

  const motDePasseHash = await bcrypt.hash(MOT_DE_PASSE_PAR_DEFAUT, 10);

  for (const u of UTILISATEURS_DEMO) {
    const role = await prisma.role.findUniqueOrThrow({ where: { nomRole: u.role } });
    await prisma.utilisateur.upsert({
      where: { email: u.email },
      update: { roleId: role.id },
      create: {
        nom: u.nom,
        prenom: u.prenom,
        email: u.email,
        motDePasse: motDePasseHash,
        roleId: role.id,
      },
    });
  }
  console.log('Utilisateurs de demo (mot de passe pour tous : "' + MOT_DE_PASSE_PAR_DEFAUT + '") :');
  for (const u of UTILISATEURS_DEMO) {
    console.log(`  - ${u.role} : ${u.email}`);
  }

  for (const c of COMPETENCES_DEMO) {
    await prisma.competence.upsert({ where: { nomCompetence: c.nomCompetence }, update: {}, create: c });
  }
  console.log(`Competences seedees : ${COMPETENCES_DEMO.map((c) => c.nomCompetence).join(', ')}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
