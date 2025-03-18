-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "colorScheme" TEXT NOT NULL DEFAULT 'cosmic-indigo',
    "particleEffects" BOOLEAN NOT NULL DEFAULT true,
    "blurEffects" BOOLEAN NOT NULL DEFAULT true,
    "animations" BOOLEAN NOT NULL DEFAULT true,
    "compactMode" BOOLEAN NOT NULL DEFAULT false,
    "persistentSidebar" BOOLEAN NOT NULL DEFAULT true,
    "fontFamily" TEXT NOT NULL DEFAULT 'inter',
    "fontSize" TEXT NOT NULL DEFAULT 'medium',

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
