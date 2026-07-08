// import { prisma } from "@/lib/prisma";

// async function migrate() {
//   console.log("Starting migration...");

//   const songs = await prisma.song.findMany({
//     select: {
//       id: true,
//       channelId: true,
//     },
//   });

//   let migrated = 0;
//   let skipped = 0;

//   for (const song of songs) {
//     // Skip if already migrated
//     if (song.channelId) {
//       skipped++;
//       continue;
//     }

//     // Find the first creator for this song
//     const creator = await prisma.songArtist.findFirst({
//       where: {
//         songId: song.id,
//         isCreator: true,
//       },
//       orderBy: {
//         createdAt: "asc",
//       },
//     });

//     if (!creator?.artistId) {
//       console.log(`No creator found for song ${song.id}`);
//       skipped++;
//       continue;
//     }

//     // Find the corresponding channel
//     const channel = await prisma.channel.findFirst({
//       where: {
//         legacyArtistId: creator.artistId,
//       },
//     });

//     if (!channel) {
//       console.log(`Channel not found for artist ${creator.artistId}`);
//       skipped++;
//       continue;
//     }

//     await prisma.song.update({
//       where: {
//         id: song.id,
//       },
//       data: {
//         channelId: channel.id,
//       },
//     });

//     migrated++;
//   }

//   console.log("-----------------------");
//   console.log(`Migrated : ${migrated}`);
//   console.log(`Skipped  : ${skipped}`);
//   console.log("Migration completed.");
// }

// migrate()
//   .catch(console.error)
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

//   // npx tsx scripts/migrate-song-channel.ts
//   // npx tsx scripts/migrate-song-artists-to-channels.ts
