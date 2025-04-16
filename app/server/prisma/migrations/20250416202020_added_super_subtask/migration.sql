-- CreateTable
CREATE TABLE "superSubtask" (
    "id" TEXT NOT NULL,
    "subtaskId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "superSubtask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "superSubtask" ADD CONSTRAINT "superSubtask_subtaskId_fkey" FOREIGN KEY ("subtaskId") REFERENCES "Subtask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
