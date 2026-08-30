#!/bin/bash
set -e

# Par defaut, l'utilisateur applicatif cree via MYSQL_USER n'a des droits que
# sur la base MYSQL_DATABASE. Prisma Migrate a besoin de pouvoir creer/supprimer
# une base "shadow" temporaire pour calculer les diffs de migration : on lui
# donne donc des privileges globaux (uniquement acceptable en environnement
# de dev local, jamais en production).
mysql -u root -p"${MYSQL_ROOT_PASSWORD}" <<-EOSQL
  GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_USER}'@'%';
  FLUSH PRIVILEGES;
EOSQL
