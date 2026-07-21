export type SongSearchItem = {
  id: string;
  slug: string;
  title: string;
  image: string;
  artist: string;
  status: 'publish' | 'archived' | 'upcoming';
  language: string;
};
