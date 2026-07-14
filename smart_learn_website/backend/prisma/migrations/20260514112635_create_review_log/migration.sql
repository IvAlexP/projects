-- CreateTable
CREATE TABLE "ReviewLog" (
    "id" SERIAL NOT NULL,
    "userCardMetadataId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "state" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stability" DOUBLE PRECISION NOT NULL,
    "difficulty" DOUBLE PRECISION NOT NULL,
    "scheduled_days" INTEGER NOT NULL,

    CONSTRAINT "ReviewLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReviewLog" ADD CONSTRAINT "ReviewLog_userCardMetadataId_fkey" FOREIGN KEY ("userCardMetadataId") REFERENCES "UserCardMetadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
