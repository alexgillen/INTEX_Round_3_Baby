// File: /frontend/src/components/RecommendationCategory.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { MovieRecommendation } from '../api/RecommendationAPI';
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

interface RecommendationCategoryProps {
  title: string;
  recommendations: MovieRecommendation[];
  loading: boolean;
}

const RecommendationCategory: React.FC<RecommendationCategoryProps> = ({ 
  title, 
  recommendations, 
  loading 
}) => {
  const [selectedMovie, setSelectedMovie] = useState<MovieRecommendation | null>(null);

  const handleMovieClick = (movie: MovieRecommendation) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  if (loading) {
    return (
      <CategoryWrapper>
        <CategoryHeader>
          <CategoryTitle>{title}</CategoryTitle>
        </CategoryHeader>
        <MovieCarousel>
          {[...Array(5)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </MovieCarousel>
      </CategoryWrapper>
    );
  }

  if (recommendations.length === 0) {
    return null; // Don't display empty categories
  }

  return (
    <CategoryWrapper>
      <CategoryHeader>
        <CategoryTitle>{title}</CategoryTitle>
      </CategoryHeader>
      
      <MovieCarousel>
        {recommendations.map((movie, index) => (
          <MovieCard 
            key={`${movie.show_id}-${index}`}
            onClick={() => handleMovieClick(movie)}
          >
            <MoviePoster $hasImage={!!movie.posterUrl}>
              {movie.posterUrl ? (
                <PosterImage 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  onError={(e) => {
                    e.currentTarget.onerror = null; // Prevent infinite loops
                    e.currentTarget.src = getRandomPosterUrl(); 
                  }}
                />
              ) : (
                <PosterImage 
                  src={getRandomPosterUrl()}
                  alt={movie.title} 
                />
              )}
            </MoviePoster>
            <MovieInfo>
              <MovieTitle>{movie.title}</MovieTitle>
              <MovieDetails>
                {movie.type} • {movie.releaseYear || ''}
              </MovieDetails>
              <RecTypeTag 
                $isCollaborative={movie.recommendation_type === "collaborative"}
              >
                {movie.recommendation_type === "collaborative" 
                  ? "Recommended for you" 
                  : "Similar content"}
              </RecTypeTag>
            </MovieInfo>
          </MovieCard>
        ))}
      </MovieCarousel>
      
      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailsModal 
          movie={selectedMovie} 
          onClose={handleCloseModal} 
          onSelectMovie={handleMovieClick} // Added to handle clicking similar movies
        />
      )}
    </CategoryWrapper>
  );
};

export default RecommendationCategory;

// Styled Components
const CategoryWrapper = styled.div`
  margin-bottom: 40px;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const CategoryTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  color: #fff;
`;

const MovieCarousel = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding-bottom: 16px;
  scrollbar-width: none; /* Firefox */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  
  -ms-overflow-style: none; /* IE and Edge */
`;

const MovieCard = styled.div`
  flex: 0 0 200px;
  background-color: #222;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.4);
    z-index: 1;
  }
`;

interface MoviePosterProps {
  $hasImage: boolean;
}

const MoviePoster = styled.div<MoviePosterProps>`
  height: 300px;
  background-color: ${props => props.$hasImage ? 'transparent' : '#333'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  overflow: hidden;
`;

const PosterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MoviePosterTitle = styled.span`
  text-align: center;
  padding: 0 10px;
  font-size: 0.9rem;
`;

const MovieInfo = styled.div`
  padding: 12px;
`;

const MovieTitle = styled.h4`
  margin: 0 0 6px 0;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MovieDetails = styled.p`
  margin: 0 0 8px 0;
  font-size: 0.8rem;
  color: #aaa;
`;

interface RecTypeTagProps {
  $isCollaborative: boolean;
}

const RecTypeTag = styled.span<RecTypeTagProps>`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  background-color: ${props => props.$isCollaborative ? 'rgba(59, 130, 246, 0.2)' : 'rgba(33, 150, 83, 0.2)'};
  color: ${props => props.$isCollaborative ? '#90caf9' : '#8f8'};
`;

const SkeletonCard = styled.div`
  flex: 0 0 200px;
  height: 400px;
  background-color: #222;
  border-radius: 5px;
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(34, 34, 34, 0) 0%,
      rgba(68, 68, 68, 0.5) 50%,
      rgba(34, 34, 34, 0) 100%
    );
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;