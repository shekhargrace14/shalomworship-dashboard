// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   const artistAlbums = await prisma.artistAlbum.findMany();

//   let migrated = 0;
//   let skipped = 0;

//   for (const relation of artistAlbums) {
//     const channel = await prisma.channel.findFirst({
//       where: {
//         legacyArtistId: relation.artistId,
//       },
//     });

//     if (!channel) {
//       console.log(
//         `❌ ArtistAlbum ${relation.id}: Channel not found for Artist ${relation.artistId}`
//       );
//       skipped++;
//       continue;
//     }

//     await prisma.artistAlbum.update({
//       where: {
//         id: relation.id,
//       },
//       data: {
//         channelId: channel.id,
//       },
//     });

//     migrated++;
//   }

//   console.log("\n🎉 ArtistAlbum migration complete");
//   console.log(`✅ Migrated: ${migrated}`);
//   console.log(`⚠️ Skipped : ${skipped}`);
// }

// main()
//   .catch(console.error)
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
