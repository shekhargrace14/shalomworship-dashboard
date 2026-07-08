// "use client"
import LinesVersion2 from '@/components/song/preview/song-preview-line-version2';
import LinesVersion3 from '@/components/song/preview/song-preview-line-version3';
import LinesVersion4 from '@/components/song/preview/song-preview-line-version4';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/VideoPlayer';
import { prisma } from '@/lib/prisma';
import { Dot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import slugify from 'slugify';

const page = async ({ params }: any) => {
  const { id } = await params; // this is the [slugAndId] part

  const songData = await prisma.song.findFirst({
    where: {
      id: id,
    },
    include: {
      credits: {
        include: {
          channel: true,
        },
      },
      channel: true,
      genre: true,

      category: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!songData) {
    notFound();
  }
  const channel = songData?.channel;
  const credits = songData?.credits;
  const categories = songData?.category?.map((c) => c.category?.slug) ?? [];
  const language = songData?.language;
  //   const langName = getLanguageName(language);
  const langName = songData?.language;
  const searchVariants = songData?.searchVariant || '';
  return (
    <div className="bg-background  rounded-lg p-4">
      {/* <JsonLd id={id} /> */}
      <div className="flex justify-end">
        <Link href={`/dashboard/song/${id}`}>
          <Button>Go Back - Edit Song</Button>
        </Link>
      </div>
      <div
        className="flex gap-4 p-4 mb-4 flex-col text-white w-full"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${songData?.color}, transparent)`,
        }}
      >
        <div className=" sm:flex items-center gap-4 w-full">
          <div className="sm:w-4/12 sm:mb-0 mb-2 rounded-lg overflow-hidden bg-background ">
            {songData?.videoId ? (
              // <YouTubeEmbed videoId={songData?.videoId} title={songData?.title} />
              <VideoPlayer videoId={songData?.videoId} title={songData?.title} />
            ) : (
              <Image src={songData?.image || '/default-image.jpg'} alt={songData?.title || 'Song Image'} width={200} height={100} className="bg-gray-800 object-cover h-auto w-full" priority={true} />
            )}
          </div>
          <div className=" relative sm:w-8/12 grid gap-2">
            <h1 className=" text-2xl md:text-4xl font-semibold mb-2 mt-2 text-foreground">{songData?.title} </h1>
            {/* <div className="absolute top-2 right-2 inline ">
              {songData && (
                <BookmarkSong
                  song={{
                    id: songData.id,
                    slug: songData ? `${songData.slug}-${songData.id}` : "",
                    title: songData.title ?? "",
                    image: songData.image ?? "",
                    channel: songData?.channel?.title ?? "",
                    status: songData.status ?? "PUBLISH",
                    language: songData.language ?? "",
                  }}
                />
              )}
            </div> */}

            {/* CHANNEL */}
            <div className="flex flex-wrap gap-2">
              {channel ? (
                <Link href={`/channel/${slugify(channel.slug, { lower: true })}-${channel.id}`} className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={channel.avatar || '/default-avatar.jpg'} />
                    <AvatarFallback>SW</AvatarFallback>
                  </Avatar>

                  <span className="font-semibold text-lg leading-4 text-foreground ">
                    {channel.title}
                    {/* {index < creators.length - 1 ? ", " : ""} */}
                  </span>
                </Link>
              ) : (
                <p className="font-semibold text-sm leading-4 text-foreground ">No creator specified</p>
              )}
            </div>

            {/* CREDITS */}
            <div className=" flex flex-wrap gap-2">
              {credits &&
                credits?.map((channel, index) => (
                  //   <Link
                  //     key={channel.channel.id}
                  //     href={`/channel/${slugify(channel.channel?.title, { lower: true })}-${channel.channel?.id}`}
                  //   >
                  <div className=" text-base leading-4 text-foreground ">
                    {channel.channel.title}
                    {index < credits?.length - 1 ? ', ' : ''}
                  </div>
                  //   </Link>
                ))}
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              {songData?.category && songData?.category.length > 0 ? (
                songData?.category.length > 1 ? (
                  songData?.category.map((category, index) => (
                    <span key={index} className="font-light text-sm leading-4 text-foreground">
                      <Link href={`/category/${category?.category.slug}`}>
                        <Badge variant="secondary" className="hover:bg-background">
                          {category?.category.title}
                        </Badge>
                      </Link>
                    </span>
                  ))
                ) : (
                  <p className="font-light text-sm leading-4 text-foreground ">
                    <Link href={`/category/${songData?.category[0]?.category.slug}`}>
                      <Badge variant="secondary">{songData?.category[0]?.category.title}</Badge>
                    </Link>
                  </p>
                )
              ) : (
                <p className="font-light text-sm leading-4 text-foreground">Unknown category</p>
              )}
              <Dot className="text-foreground" />

              <Link href={`/language/${language}`}>
                <Badge variant="secondary">{langName}</Badge>
              </Link>
              <div className=" ">{/* <ShareButton title={songData?.title} /> */}</div>
            </div>
            {/* {songData?.album && songData?.album.length > 0 && (
              <p className="text-sm text-foreground">
                Album :{" "}
                <Link href={`/album/${albumSlug}`}>
                  <strong> {albumTitle} </strong>
                </Link>
              </p>
            )} */}
            {songData?.category[0] ? (
              <div className="">
                <p className="text-xs text-foreground">
                  <strong>{songData?.title}</strong>
                  {`  is a Christian worship song by `}

                  <strong>{channel?.title}</strong>

                  {`, commonly sung in moments of `}

                  <strong>
                    {songData?.category && songData?.category.length > 0 ? (
                      songData?.category.length > 1 ? (
                        songData?.category.map((category, index) => (
                          <span key={index} className="text-xs leading-4 text-foreground">
                            <Link href={`/category/${category?.category.slug}`}>{category?.category.title}</Link>
                            {index < songData?.category.length - 1 ? ', ' : ''}
                          </span>
                        ))
                      ) : (
                        <Link href={`/category/${songData?.category[0]?.category.slug}`}>{songData?.category[0]?.category.title}</Link>
                      )
                    ) : (
                      <p className="font-light text-sm leading-4 text-foreground">Unknown category</p>
                    )}
                  </strong>

                  {`. This page provides the lyrics ${songData?.isChords ? ', chords & Nashville Number System' : ''}, prepared for congregational worship and personal devotion.`}

                  {songData?.searchVariant[0] && (
                    <>
                      {' This song is widely known by the refrain "'}
                      <strong>{searchVariants[0]}</strong>
                      {'".'}
                    </>
                  )}
                </p>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto p-4 pt-4 relative">
        {/* {songData?.version === "version_1" ? <div>
          <section className="w-full text-foreground">
            <h2 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">
              {songData?.title} lyrics
            </h2>
            <div dangerouslySetInnerHTML={{ __html: songData?.content }} />
          </section>
        </div> : null} */}
        {songData?.version === 'version_2' ? <LinesVersion2 id={songData?.id} song={songData} isChords={!!songData?.isChords} /> : null}
        {songData?.version === 'version_3' ? <LinesVersion3 id={songData?.id} song={songData} isChords={!!songData?.isChords} isTranslations={!!songData?.isTranslation} language={songData?.language} /> : null}
        {songData?.version === 'version_4' ? <LinesVersion4 id={songData?.id} song={songData} isChords={!!songData?.isChords} isTranslations={!!songData?.isTranslation} language={songData?.language} /> : null}

        {/* <Social /> */}

        {/* <h2 className="text-xl font-semibold mb-2 mt-8 text-foreground">
          Songs Based on&nbsp;
          {songData?.category && songData?.category.length > 0 ? (
            songData?.category.length > 1 ? (
              songData?.category.map((category, index) => (
                <span
                  key={index}
                >
                  <Link href={`/category/${category?.category.slug}`}>
                    {category?.category.title}
                  </Link>
                  {index < songData?.category.length - 1 ? ", " : ""}
                </span>
              ))
            ) : (
              <Link href={`/category/${songData?.category[0]?.category.slug}`}>
                {songData?.category[0]?.category.title}
              </Link>
            )
          ) : (
            <p className="font-light text-sm leading-4 text-foreground">
              Unknown category
            </p>
          )}
        </h2> */}

        {/* {categories.length > 0 ? (
          categories?.map((id: any) => (
            <Fragment key={id}>
              <CategoryProcess params={id} />
            </Fragment>
          ))
        ) : (
          <p className="font-light text-sm leading-4 text-foreground">
            No creator specified
          </p>
        )} */}

        <h2 className="text-xl font-semibold mb-2 mt-8 text-foreground">
          Popular songs by&nbsp;
          {/* <Link className="underline" href={`/channel/${slugify(songData?.channel?.title ?? "", { lower: true })}-${channel?.id}`}>
            {channel?.title}
          </Link> */}
        </h2>

        {/* {channel ? (
            <Fragment key={channel.id}>
              <CreatorSongs params={channel.id} />
            </Fragment>
        ) : (
          <p className="font-light text-sm leading-4 text-foreground">
            No creator specified
          </p>
        )} */}
      </div>
    </div>
  );
};

export default page;
