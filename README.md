# SkillTest

Application d'evaluation des competences techniques (Projet Fil Rouge).

Plateforme permettant d'evaluer les competences techniques des collaborateurs
via des quiz/evaluations, de generer des parcours d'apprentissage personnalises,
de suivre la progression et de produire des rapports pour les managers et les RH.

## Stack technique

- **Front-end** : Angular 22
- **Back-end** : NestJS 12 (Node.js)
- **Base de donnees** : MySQL 8.4 (administree via phpMyAdmin)
- **ORM** : Prisma
- **Conteneurisation** : Docker / Docker Compose

## Acteurs

- **Collaborateur** : passe les evaluations, suit ses resultats et sa progression.
- **Manager** : consulte les rapports de performance de son equipe, gere les parcours.
- **Responsable RH** : supervise les parcours d'evaluation, gere les competences au niveau de l'organisation.

## Structure du projet

```
SkillTest/
|-- backend/          # API NestJS + Prisma
|-- frontend/          # Application Angular
|-- docker-compose.yml
|-- .env.example
`-- README.md
```

## Demarrage (developpement)

1. Copier le fichier d'environnement si besoin : `cp .env.example .env` (deja fait pour le dev local).
2. Lancer l'ensemble de la stack :

   ```bash
   docker compose up --build
   ```

3. Services disponibles :
   - Frontend Angular : http://localhost:4200
   - Backend NestJS : http://localhost:3000
   - phpMyAdmin : http://localhost:8081 (utilisateur `root`, mot de passe defini dans `.env`)
   - MySQL : localhost:3306

## Base de donnees

Le schema est defini avec Prisma dans `backend/prisma/schema.prisma`, a partir
du MLD du projet (entites : Role, Utilisateur, Parcours, Evaluation, Competence,
Competence_Utilisateur, Question, Reponse, Passage_Evaluation).

Une fois les conteneurs lances, pour appliquer le schema a la base :

```bash
docker compose exec backend npm run prisma:migrate -- --name init
```

## Etat d'avancement

- [x] Etape 0 : initialisation du repo, scaffolding Angular/NestJS, Docker Compose (MySQL + phpMyAdmin + backend + frontend)
- [x] Schema de donnees Prisma (a valider)
- [ ] Authentification (inscription / connexion, roles)
- [ ] Gestion des competences et parcours
- [ ] Quiz / evaluations et passages
- [ ] Tableaux de bord et rapports
