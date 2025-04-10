import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { fetchMovies } from '../api/MovieAPI';
import { Movie } from '../types/Movie';
import MovieDetailsModal from './MovieDetailsModal';

// Array of default poster options
const DEFAULT_POSTER_OPTIONS = [
  'https://image.tmdb.org/t/p/original/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', // The Matrix
  'https://image.tmdb.org/t/p/original/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg', // Star Wars
  'https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', // Titanic
  'https://image.tmdb.org/t/p/original/5KCVkau1HEl7ZzfPsKAPM0sMiKc.jpg', // Inception
  'https://image.tmdb.org/t/p/original/rPpxrz8o0svAPCLucjsEdMXoDfX.jpg', // Forrest Gump
  'https://image.tmdb.org/t/p/original/vL5LR6WdxWPjLPFRLe133jXWsh5.jpg', // The Dark Knight
  'https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg'  // The Godfather
];

// Function to get a random poster URL
const getRandomPosterUrl = () => {
  const randomIndex = Math.floor(Math.random() * DEFAULT_POSTER_OPTIONS.length);
  return DEFAULT_POSTER_OPTIONS[randomIndex];
};

const POPULAR_GENRES = [
  'Action', 'Adventure', "Children", "Comedies", "Documentaries", "Dramas",
  "Fantasy", "Horror Movies", "Kids' TV", "Musicals", "Reality TV"
];

interface Props {
  onClose: () => void;
}

const SearchOverlay: React.FC<Props> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // Use HTTPS in production, HTTP in development
        const isDevelopment = window.location.hostname === 'localhost';
        const baseUrl = isDevelopment ? "http://localhost:5000" : "https://localhost:5002";
        
        const res = await fetch(`${baseUrl}/api/Movie/GetGenres`);
        if (!res.ok) {
          throw new Error('Failed to load genres');
        }
        const data = await res.json();
        const filtered = data.filter((g: string) => POPULAR_GENRES.includes(g));
        setGenres(filtered);
      } catch (err) {
        console.error('Failed to load genres', err);
      }
    };
    fetchGenres();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await fetchMovies(50, 1, selectedGenres, query);
      setResults(data.movies);
      if (resultsRef.current) resultsRef.current.scrollTop = 0;
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [selectedGenres]);

  const handleClickMovie = (id: string) => {
    const movie = results.find(m => m.show_id === id);
    if (movie) setSelectedMovie(movie);
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  return (
    <Overlay>
      <LeftPanel>
        <BackButton onClick={onClose}>← Back</BackButton>
        <SearchInput
          placeholder="Search for a movie..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <SearchBtn onClick={handleSearch}>Search</SearchBtn>

        <FilterLabel>Popular Genres</FilterLabel>
        <GenresWrapper>
          {genres.map((genre) => (
            <GenreButton
              key={genre}
              onMouseDown={() => toggleGenre(genre)}
              $active={selectedGenres.includes(genre)}
            >
              {genre}
            </GenreButton>
          ))}
        </GenresWrapper>
      </LeftPanel>

      <RightPanel ref={resultsRef}>
        {loading ? (
          <LoadingText>Loading...</LoadingText>
        ) : results.length > 0 ? (
          <ResultsGrid>
            {results.map((movie) => (
              <MovieCard key={movie.show_id} onClick={() => handleClickMovie(movie.show_id)}>
                <MoviePoster src={movie.posterUrl || getRandomPosterUrl()} />
                <MovieTitle>{movie.title}</MovieTitle>
                <MovieMeta>{movie.release_year} • {movie.rating}</MovieMeta>
              </MovieCard>
            ))}
          </ResultsGrid>
        ) : (
          <EmptyText>
            {query ? 'No results found.' : 'Start typing to search.'}
          </EmptyText>
        )}
      </RightPanel>

      {selectedMovie && (
        <MovieDetailsModal
          movie={{
            show_id: selectedMovie.show_id,
            title: selectedMovie.title || '',
            type: selectedMovie.type || '',
            posterUrl: selectedMovie.posterUrl || getRandomPosterUrl(),
            director: selectedMovie.director,
            cast: selectedMovie.cast,
            description: selectedMovie.description,
            rating: selectedMovie.rating,
            duration: selectedMovie.duration,
            releaseYear: selectedMovie.release_year ?? 0, // ✅ convert snake_case to camelCase
            country: selectedMovie.country,
            genre: selectedMovie.genres || '',
            recommendation_type: 'content',
            demographic_segment: '',
            gender: '',
            age_group: '',
            created_at: new Date().toISOString(),
          }}
          onClose={() => setSelectedMovie(null)}
          onSelectMovie={(m) =>
            setSelectedMovie({
              show_id: m.show_id,
              title: m.title,
              type: m.type,
              posterUrl: m.posterUrl,
              director: m.director,
              cast: m.cast,
              description: m.description,
              rating: m.rating,
              duration: m.duration,
              release_year: m.releaseYear ?? 0,
              country: m.country,
              genres: m.genre,
            })
          }
        />
      )}
    </Overlay>
  );
};

export default SearchOverlay;

// ===== Styled Components =====

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: #141414; display: flex; z-index: 9999;
`;

const LeftPanel = styled.div`
  width: 30%; padding: 40px 30px; background: #1a1a1a;
  display: flex; flex-direction: column; gap: 20px;
  border-right: 1px solid #333;
`;

const RightPanel = styled.div`
  flex: 1; padding: 40px; overflow-y: auto;
`;

const BackButton = styled.button`
  background: none; border: none; color: #ccc;
  font-size: 1rem; cursor: pointer;
  &:hover { color: white; }
`;

const SearchInput = styled.input`
  padding: 10px; font-size: 1rem;
  background: #222; color: white;
  border: 1px solid #444; border-radius: 4px;
`;

const SearchBtn = styled.button`
  background: #3b82f6; 
  color: white;
  border: none; 
  padding: 10px;
  border-radius: 4px; 
  font-weight: bold; 
  cursor: pointer;
  &:hover { background: #2563eb; }
`;

const FilterLabel = styled.div`
  color: #ccc; font-size: 0.9rem;
`;

const GenresWrapper = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px;
`;

const GenreButton = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? '#3b82f6' : '#333')};
  color: ${({ $active }) => ($active ? 'white' : 'white')};
  border: 1px solid #444;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  &:hover { background: #2563eb; color: white; }
  &:focus { outline: none; }
`;

const ResultsGrid = styled.div`
  display: flex; flex-wrap: wrap; gap: 20px;
`;

const MovieCard = styled.div`
  width: 160px; cursor: pointer;
  &:hover { opacity: 0.85; }
`;

const MoviePoster = styled.img`
  width: 100%; height: 240px; object-fit: cover;
  border-radius: 6px;
`;

const MovieTitle = styled.div`
  font-size: 1rem; color: #fff; margin-top: 8px;
`;

const MovieMeta = styled.div`
  font-size: 0.8rem; color: #aaa;
`;

const LoadingText = styled.div`
  color: #aaa; text-align: center; padding: 20px;
`;

const EmptyText = styled.div`
  color: #888; text-align: center; padding: 20px;
`;
