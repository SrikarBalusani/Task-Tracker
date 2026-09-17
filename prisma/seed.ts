import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultTasks = [
  'DSA',
  'OS',
  'JS Project',
  'Learning German',
  'NIAT Masterclass',
  'E-Myth Book',
  'GATE Preparation'
]

async function main() {
  console.log(`Start seeding ...`)
  
  for (const name of defaultTasks) {
    const task = await prisma.task.findFirst({
      where: { name, isPermanent: true }
    })
    
    if (!task) {
      await prisma.task.create({
        data: {
          name,
          isPermanent: true,
        }
      })
      console.log(`Created permanent task: ${name}`)
    } else {
      console.log(`Task already exists: ${name}`)
    }
  }
  
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
