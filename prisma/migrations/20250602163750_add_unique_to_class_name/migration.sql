/*
  Warnings:

  - You are about to drop the column `facultyId` on the `Class` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Faculty` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_facultyId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "facultyId";

-- CreateTable
CREATE TABLE "_FacultyClasses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FacultyClasses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FacultyClasses_B_index" ON "_FacultyClasses"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Class_name_key" ON "Class"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_email_key" ON "Faculty"("email");

-- AddForeignKey
ALTER TABLE "_FacultyClasses" ADD CONSTRAINT "_FacultyClasses_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacultyClasses" ADD CONSTRAINT "_FacultyClasses_B_fkey" FOREIGN KEY ("B") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
