import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const songArtists = await prisma.songArtist.findMany();

  console.log(`Found ${songArtists.length} SongArtist records`);

  let migrated = 0;
  let skipped = 0;

  for (const relation of songArtists) {
    const channel = await prisma.channel.findFirst({
      where: {
        legacyArtistId: relation.artistId,
      },
    });

    if (!channel) {
      console.log(`❌ No channel found for artist ${relation.artistId}`);
      skipped++;
      continue;
    }

    await prisma.songArtist.update({
      where: {
        id: relation.id,
      },
      data: {
        channelId: channel.id,
      },
    });

    migrated++;
  }

  console.log(`\n✅ Migrated: ${migrated}`);
  console.log(`⚠️ Skipped : ${skipped}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });