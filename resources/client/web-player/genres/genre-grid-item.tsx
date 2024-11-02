import {Genre} from '@app/web-player/genres/genre';
import {Link} from 'react-router-dom';
import {getGenreLink} from '@app/web-player/genres/genre-link';
import {useMemo} from 'react';

const bgColors = [
  'rgb(0, 100, 80)',
  'rgb(220, 20, 140)',
  'rgb(132, 0, 231)',
  'rgb(30, 50, 100)',
  'rgb(71, 125, 149)',
  'rgb(225, 51, 0)',
  'rgb(71, 125, 149)',
  'rgb(13, 115, 236)',
  'rgb(0, 100, 80)',
  'rgb(80, 55, 80)',
  'rgb(175, 40, 150)',
  'rgb(71, 125, 149)',
  'rgb(233, 20, 41)',
  'rgb(141, 103, 171)',
  'rgb(71, 125, 149)',
  'rgb(225, 17, 140)',
  'rgb(119, 119, 119)',
  'rgb(141, 103, 171)',
  'rgb(216, 64, 0)',
  'rgb(186, 93, 7)',
  'rgb(225, 17, 140)',
];

interface GenreGridItemProps {
  genre: Genre;
}
export function GenreGridItem({genre}: GenreGridItemProps) {
  const label = genre.display_name || genre.name;

  const bgColor = useMemo(() => {
    const hash = (label || '')
      .split('')
      .reduce((accum, val) => val.charCodeAt(0) + accum, label?.length || 0);
    return bgColors[hash % bgColors.length];
  }, [label]);

  return (
    <Link
      to={getGenreLink(genre)}
      className="relative isolate flex h-120 items-center justify-center overflow-hidden rounded-panel bg-chip p-12 text-xl font-semibold capitalize"
    >
      {genre.image ? (
        <img
          src={genre.image}
          alt=""
          className="absolute inset-0 z-10 h-full w-full object-cover"
        />
      ) : null}
      <div
        className="absolute inset-0 z-20 h-full w-full"
        style={{
          backgroundColor: bgColor,
          opacity: genre.image ? 0.9 : 1,
        }}
      />
      <div className="relative z-30 text-center text-white">
        {genre.display_name || genre.name}
      </div>
    </Link>
  );
}
