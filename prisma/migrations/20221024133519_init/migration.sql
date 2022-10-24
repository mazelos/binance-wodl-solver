-- CreateTable
CREATE TABLE "Words" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "initial" TEXT NOT NULL,

    CONSTRAINT "Words_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Words_word_key" ON "Words"("word");
