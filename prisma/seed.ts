import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const notificationType = await prisma.notificationType.create({
    data: {
      type: "list_invitation"
    }
  })
}

main()
  .then(async (result) => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })