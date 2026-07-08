'use client';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

export default function VideoPlayer({ videoId, title }: any) {
  return (
    <div className="video-container">
      <LiteYouTubeEmbed
        id={videoId}
        title={title}
        poster="hqdefault" // Loads a smaller thumbnail than 'maxresdefault'
        noCookie={true} // Better for privacy and slight speed boost
      />
    </div>
  );
}
