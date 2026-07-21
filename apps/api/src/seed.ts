import type { PrismaClient } from '@rh/database/client';

export async function seedDatabase(prisma: PrismaClient) {
  await prisma.category.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'personal-information',
        name: 'Personal Information',
        sortOrder: 1,
      },
      {
        id: 'contact-information',
        name: 'Contact Information',
        sortOrder: 2,
      },
      {
        id: 'professional-summary',
        name: 'Professional Summary',
        sortOrder: 3,
      },
      {
        id: 'work-experience',
        name: 'Work Experience',
        sortOrder: 4,
      },
      {
        id: 'education',
        name: 'Education',
        sortOrder: 5,
      },
      {
        id: 'skills',
        name: 'Skills',
        sortOrder: 6,
      },
      {
        id: 'languages',
        name: 'Languages',
        sortOrder: 7,
      },
      {
        id: 'certifications',
        name: 'Certifications',
        sortOrder: 8,
      },
      {
        id: 'portfolio-links',
        name: 'Portfolio & Links',
        sortOrder: 9,
      },
    ],
  });
}
