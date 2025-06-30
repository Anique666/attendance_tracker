
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('DB seeding in progress');


  const admin = await prisma.admin.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
    },
  });

  const class1 = await prisma.class.create({
    data: {
      name: 'ISE-4A',
    },
  });


  const faculty1 = await prisma.faculty.create({
    data: {
      name: 'Prof. Rao',
      email: 'rao@college.edu',
      password: 'faculty123',
      classes: {
        connect: { id: class1.id },
      },
    },
  });


  const student1 = await prisma.student.create({
    data: {
      usn: '1IS21IS001',
      name: 'Anish Kasetty',
      email: 'anish@student.edu',
      password: 'student123',
      class: {
        connect: { id: class1.id },
      },
    },
  });

  const student2 = await prisma.student.create({
    data: {
      usn: '1IS21IS002',
      name: 'Anique Dev',
      email: 'anique@student.edu',
      password: 'student456',
      class: {
        connect: { id: class1.id },
      },
    },
  });


  const event1 = await prisma.event.create({
    data: {
      name: 'Workshop',
      date: new Date('2025-07-10'),
      createdByAdmin: true,
    },
  });


  await prisma.attendance.createMany({
    data: [
      {
        studentId: student1.id,
        eventId: event1.id,
        reason: 'Event Participation',
        status: 'Present',
      },
      {
        studentId: student2.id,
        eventId: event1.id,
        reason: 'Event Participation',
        status: 'Condoned',
      },
    ],
  });


  await prisma.condonationRequest.createMany({
    data: [
      {
        reason: 'Medical Leave',
        mediaUrl: 'https://example.com/medical-note.jpg',
        status: 'Pending',
        studentId: student1.id,
        facultyId: faculty1.id,
        eventId: event1.id,
      },
      {
        reason: 'Hackathon',
        mediaUrl: 'https://example.com/hackathon-pass.jpg',
        status: 'Approved',
        studentId: student2.id,
        facultyId: faculty1.id,
        eventId: event1.id,
      },
    ],
  });

  console.log('Seeding completed');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Seed error:', e);
    prisma.$disconnect();
    process.exit(1);
  });
