
import {
  PrismaClient,
  ArtistType,
  ChannelType,
} from "@prisma/client";

const prisma = new PrismaClient();

function convertType(
  type: ArtistType | null
): ChannelType {
  switch (type) {
    case "individual":
      return "PERSON";

    case "band":
      return "BAND";

    case "label":
      return "LABEL";

    case "channel":
      return "ORGANIZATION";

    default:
      return "PERSON";
  }
}

async function main() {
  const artists = await prisma.artist.findMany();

  console.log(`Found ${artists.length} artists`);

  let migrated = 0;

  for (const artist of artists) {
    await prisma.channel.upsert({
      where: {
        slug: artist.slug,
      },
      update: {},

      create: {
        legacyArtistId: artist.id,
        title: artist.title,
        slug: artist.slug,

        type: convertType(artist.type),

        avatar: artist.image,
        description: artist.about,

        verified: artist.isVerified ?? false,
        claimed: false,

        website: artist.link,

        email: artist.email,

        instagram: artist.instagram,
        youtube: artist.youtube,
        spotify: artist.spotify,
        appleMusic: artist.appleMusic,
        amazonMusic: artist.amazonMusic,
        
        tidal: artist.tidal,
        deezer: artist.deezer,
        soundCloud: artist.soundCloud,
        pandora: artist.pandora,

        color: artist.color,
      },
    });

    migrated++;
    console.log(`✅ ${artist.title}`);
  }

  console.log(`\n🎉 Migration Complete`);
  console.log(`Migrated ${migrated} artists`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

