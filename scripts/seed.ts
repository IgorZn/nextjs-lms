import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  console.time('Seeding complete 🌱')

  await prisma.category.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Computer science' },
      { name: 'Music' },
      { name: 'Photography' },
      { name: 'Accounting' },
      { name: 'Filming' },
    ],
  })

  console.timeEnd('Seeding complete 🌱')
}

main()
  .then(() => {
    console.log('Process completed')
  })
  .catch(e => console.log(e))
