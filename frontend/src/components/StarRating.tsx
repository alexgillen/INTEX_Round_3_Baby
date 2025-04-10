import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

type Props = {
  showId: string;
};

// Helper function to manage ratings in localStorage
const userRatingsManager = {
  key: 'userMovieRatings',
  
  // Get all stored ratings
  getAllRatings: (): Record<string, number> => {
    const stored = localStorage.getItem('userMovieRatings');
    return stored ? JSON.parse(stored) : {};
  },
  
  // Get rating for a specific movie
  getRating: (movieId: string): number => {
    const ratings = userRatingsManager.getAllRatings();
    return ratings[movieId] || 0;
  },
  
  // Save rating for a movie
  saveRating: (movieId: string, rating: number): void => {
    const ratings = userRatingsManager.getAllRatings();
    ratings[movieId] = rating;
    localStorage.setItem('userMovieRatings', JSON.stringify(ratings));
  }
};

const StarRating: React.FC<Props> = ({ showId }) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);

  // Fetch user's rating for this movie from localStorage
  useEffect(() => {
    // Only load ratings if user is logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      const savedRating = userRatingsManager.getRating(showId);
      setRating(savedRating);
    }
  }, [showId]);

  // Save rating to localStorage
  const submitRating = (newRating: number) => {
    // Only save ratings if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    userRatingsManager.saveRating(showId, newRating);
    setRating(newRating);
  };

  return (
    <Container>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          $filled={star <= (hover || rating)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => submitRating(star)}
        >
          ★
        </Star>
      ))}
      <RatingLabel>{!rating && 'Rate this movie'}</RatingLabel>
    </Container>
  );
};

export default StarRating;

// ================= STYLED COMPONENTS =================

const Container = styled.div`
  margin-top: 30px;
`;

const Star = styled.span<{ $filled: boolean }>`
  font-size: 2rem;
  color: ${({ $filled }) => ($filled ? '#FFD700' : '#444')};
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: #FFD700;
  }
`;

const RatingLabel = styled.div`
  margin-top: 8px;
  font-size: 0.9rem;
  color: #bbb;
`;
