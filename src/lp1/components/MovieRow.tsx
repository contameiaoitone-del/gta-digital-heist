
import { useRef } from "react";
import MovieCard from "./MovieCard";

export interface Movie {
  id: string;
  imageUrl: string;
  link: string;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

const MovieRow = ({ title, movies }: MovieRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-netflix text-left px-4 mb-2">{title}</h2>
      <div 
        ref={scrollRef} 
        className="movie-card-container flex overflow-x-auto gap-4 py-2 px-4 scroll-smooth snap-x"
        style={{ overscrollBehaviorX: 'contain' }}
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            imageUrl={movie.imageUrl}
            link={movie.link}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieRow;
