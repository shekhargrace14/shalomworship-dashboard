import { prisma } from '../lib/prisma';
import { convertLyricsV3ToV4 } from '../lib/lyrics/convert-v3-to-v4';

const SONG_ID = process.argv[2];
const APPLY = process.argv.includes('--apply');

function parseLyrics(value: unknown) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      throw new Error('Lyrics is a string, but it is not valid JSON');
    }
  }

  throw new Error('This song does not contain v3 lyrics array data');
}

async function main() {
  if (!SONG_ID) {
    throw new Error('Use: npx tsx scripts/convert-one-song-v3-to-v4.ts SONG_ID');
  }

  const song = await prisma.song.findUnique({
    where: {
      id: SONG_ID,
    },
    select: {
      id: true,
      title: true,
      lyrics: true,
    },
  });

  if (!song) {
    throw new Error('Song not found');
  }

  const lyricsV3 = parseLyrics(song.lyrics);

  const convertedLyrics = convertLyricsV3ToV4(lyricsV3);

  console.log('\nSONG:');
  console.log(song.title);
  console.log(song.id);

  console.log('\nV4 PREVIEW:');
  console.dir(convertedLyrics, {
    depth: null,
  });

  if (!APPLY) {
    console.log('\nDRY RUN ONLY. Database was not changed.');
    console.log('\nWhen preview looks correct, run again with --apply');

    return;
  }

  await prisma.song.update({
    where: {
      id: song.id,
    },
    data: {
      // Your database currently stores lyrics as String.
      lyrics: JSON.stringify(convertedLyrics),

      // Uncomment only if this field exists in your Prisma Song model:
      // lyricsVersion: 4,
    },
  });

  console.log('\nConverted successfully.');
}

main()
  .catch((error) => {
    console.error('CONVERSION FAILED:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
