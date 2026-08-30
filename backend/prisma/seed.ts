import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ROLES = ['Collaborateur', 'Manager', 'Responsable RH'];

async function main() {
  for (const nomRole of ROLES) {
    await prisma.role.upsert({
      where: { nomRole },
      update: {},
      create: { nomRole },
    });
  }
  console.log(`Roles seedes : ${ROLES.join(', ')}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
