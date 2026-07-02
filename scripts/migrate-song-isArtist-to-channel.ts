import { CreditRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

async function migrate() {
  console.log("Starting SongCredit migration...");

  const songArtists = await prisma.songArtist.findMany({
    where: {
      isArtist: true,
    },
  });

  let migrated = 0;
  let skipped = 0;

  for (const item of songArtists) {
    if (!item.artistId) {
      skipped++;
      continue;
    }

    const channel = await prisma.channel.findFirst({
      where: {
        legacyArtistId: item.artistId,
      },
    });

    if (!channel) {
      console.log(`Channel not found for artist ${item.artistId}`);
      skipped++;
      continue;
    }

    // Prevent duplicates
    const exists = await prisma.songCredit.findFirst({
      where: {
        songId: item.songId,
        channelId: channel.id,
        role: CreditRole.SINGER,
      },
    });

    if (exists) {
      skipped++;
      continue;
    }

    await prisma.songCredit.create({
      data: {
        songId: item.songId,
        channelId: channel.id,
        role: CreditRole.SINGER,
      },
    });

    migrated++;
  }

  console.log("-----------------------");
  console.log(`Migrated : ${migrated}`);
  console.log(`Skipped  : ${skipped}`);
  console.log("Migration completed.");
}

migrate()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });