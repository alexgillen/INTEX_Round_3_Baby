// File: /frontend/src/pages/HomePage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import logo from '../images/nobackground.png';
import { logout } from '../components/AuthAPI';
import { fetchAllRecommendations, MovieRecommendation } from '../api/RecommendationAPI';
import { fetchMovies } from '../api/MovieAPI';
import { Movie } from '../types/Movie';
import RecommendationCategory from '../components/RecommendationCategory';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import SearchOverlay from '../components/SearchOverly';
import MovieDetailsModal from '../components/MovieDetailsModal';

interface UserData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  age?: number;
  gender?: string;
  phone?: string;
  profileCompleted?: boolean;
}

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

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [recommendations, setRecommendations] = useState<Record<string, MovieRecommendation[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [collaborativeRecs, setCollaborativeRecs] = useState<MovieRecommendation[]>([]);
  const [contentBasedRecs, setContentBasedRecs] = useState<Record<string, MovieRecommendation[]>>({});
  
  // New states for infinite scrolling and general movies
  const [generalMovies, setGeneralMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [totalMovies, setTotalMovies] = useState<number>(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastMovieElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore]);

  const token = localStorage.getItem('authToken');
  const userDataStr = localStorage.getItem('userData');

  useEffect(() => {
    if (!token || !userDataStr) {
      navigate('/login');
      return;
    }
    try {
      const parsedUserData = JSON.parse(userDataStr);
      setUserData(parsedUserData);
    } catch (error) {
      localStorage.clear();
      navigate('/login');
    }
  }, [navigate, token, userDataStr]);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const data = await fetchAllRecommendations(10);
        setRecommendations(data);

        if (data["For You"]) {
          setCollaborativeRecs(data["For You"]);
        }

        const contentBased: Record<string, MovieRecommendation[]> = {};
        Object.keys(data).forEach(category => {
          if (category !== "For You") {
            contentBased[category] = data[category];
          }
        });
        setContentBasedRecs(contentBased);
        setError(null);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  // New effect for infinite scroll
  useEffect(() => {
    const loadMoreMovies = async () => {
      if (page === 1 && generalMovies.length > 0) return;
      
      try {
        setLoadingMore(true);
        const response = await fetchMovies(24, page, [], '');
        
        if (page === 1) {
          setGeneralMovies(response.movies);
        } else {
          setGeneralMovies(prev => [...prev, ...response.movies]);
        }
        
        setTotalMovies(response.totalNumMovies);
        setHasMore(generalMovies.length + response.movies.length < response.totalNumMovies);
      } catch (err) {
        console.error('Error loading more movies:', err);
      } finally {
        setLoadingMore(false);
      }
    };
    
    loadMoreMovies();
  }, [page]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  if (loading) return <LoadingScreen>Loading...</LoadingScreen>;

  if (!token || !userDataStr) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <GlobalStyle />
      <PageWrapper>
        <Header>
          <LogoImg src={logo} alt="CineNiche Logo" onClick={() => navigate('/home')} />
          <HeaderRight>
            <SearchButton onClick={() => setShowSearchOverlay(true)}>Search</SearchButton>
            {userData && userData.role === "Admin" && (
              <AdminButton onClick={() => navigate('/adminMoviesPage')}>Edit Movies</AdminButton>
            )}
            {userData && <WelcomeText>Welcome, {userData.firstName}!</WelcomeText>}
            <LogoutButton onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? 'Logging Out...' : 'Logout'}
            </LogoutButton>
          </HeaderRight>
        </Header>

        <HeroSection>
          <HeroContent>
            <HeroTitle>Personalized Movie Recommendations</HeroTitle>
            <HeroDescription>
              Discover your next favorite films based on your preferences and similar viewers.
            </HeroDescription>
          </HeroContent>
        </HeroSection>

        <MainContent>
          {error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : (
            <>
              <RecommendationWrapper>
                <SectionTitle>Movies Just for You</SectionTitle>
                {collaborativeRecs.length > 0 ? (
                  <RecommendationBox>
                    <RecommendationDescription>
                      Personalized recommendations based on your demographic profile
                    </RecommendationDescription>
                    <RecommendationCategory title="For You" recommendations={collaborativeRecs} loading={false} />
                  </RecommendationBox>
                ) : (
                  <RecommendationBox>
                    <div style={{ textAlign: 'center' }}>
                      <EmptyStateText>
                        No personalized recommendations found. This could be due to:
                      </EmptyStateText>
                      <EmptyStateList>
                        <EmptyStateListItem>Your profile needs age and gender information</EmptyStateListItem>
                        <EmptyStateListItem>No recommendations match your demographic profile</EmptyStateListItem>
                        <EmptyStateListItem>Demographic data format mismatch</EmptyStateListItem>
                      </EmptyStateList>
                      <PlayButton onClick={() => navigate('/profile')}>Update Profile</PlayButton>
                    </div>
                  </RecommendationBox>
                )}
              </RecommendationWrapper>

              <RecommendationWrapper>
                <SectionTitle>Genre Favorites</SectionTitle>
                {Object.keys(contentBasedRecs).length > 0 ? (
                  <RecommendationBox>
                    <RecommendationDescription>
                      Recommendations based on genres and content categories
                    </RecommendationDescription>
                    <div style={{ marginTop: '20px' }}>
                      {Object.keys(contentBasedRecs).map(category => (
                        <div key={category} style={{ marginBottom: '40px' }}>
                          <RecommendationCategory title={category} recommendations={contentBasedRecs[category]} loading={false} />
                        </div>
                      ))}
                    </div>
                  </RecommendationBox>
                ) : (
                  <RecommendationBox>
                    <div style={{ textAlign: 'center' }}>
                      <EmptyStateText>No content-based recommendations found.</EmptyStateText>
                    </div>
                  </RecommendationBox>
                )}
              </RecommendationWrapper>

              <PrivacyLinkContainer>
                <PrivacyLink onClick={() => navigate('/privacy')}>
                  Privacy Policy
                </PrivacyLink>
              </PrivacyLinkContainer>
              
              {/* Infinite scroll movies section */}
              <RecommendationWrapper>
                <SectionTitle>Explore More Movies</SectionTitle>
                <ExploreDescription>
                  Scroll down to discover more movies from our catalog
                </ExploreDescription>
                
                {generalMovies.length > 0 ? (
                  <MoviesGrid>
                    {generalMovies.map((movie, index) => {
                      if (generalMovies.length === index + 1) {
                        // Last element - attach ref for infinite scrolling
                        return (
                          <MovieCard 
                            ref={lastMovieElementRef} 
                            key={movie.show_id} 
                            onClick={() => handleMovieClick(movie)}
                          >
                            <MoviePoster src={movie.posterUrl || getRandomPosterUrl()} />
                            <MovieTitle>{movie.title}</MovieTitle>
                            <MovieMeta>{movie.release_year} • {movie.rating}</MovieMeta>
                          </MovieCard>
                        );
                      } else {
                        // Regular movie card
                        return (
                          <MovieCard 
                            key={movie.show_id} 
                            onClick={() => handleMovieClick(movie)}
                          >
                            <MoviePoster src={movie.posterUrl || getRandomPosterUrl()} />
                            <MovieTitle>{movie.title}</MovieTitle>
                            <MovieMeta>{movie.release_year} • {movie.rating}</MovieMeta>
                          </MovieCard>
                        );
                      }
                    })}
                  </MoviesGrid>
                ) : (
                  <RecommendationBox>
                    <div style={{ textAlign: 'center' }}>
                      <EmptyStateText>No movies found.</EmptyStateText>
                    </div>
                  </RecommendationBox>
                )}
                
                {loadingMore && <LoadingMore>Loading more movies...</LoadingMore>}
              </RecommendationWrapper>
            </>
          )}

          {!loading && Object.keys(recommendations).length === 0 && !generalMovies.length && (
            <EmptyStateContainer>
              <EmptyStateText>
                No recommendations or movies found. Please try again later.
              </EmptyStateText>
              <PlayButton onClick={() => navigate('/profile')}>Update Profile</PlayButton>
            </EmptyStateContainer>
          )}
        </MainContent>

        <Footer>
          &copy; {new Date().getFullYear()} CineNiche. All rights reserved.{' '}
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
        </Footer>

      </PageWrapper>

      {showSearchOverlay && <SearchOverlay onClose={() => setShowSearchOverlay(false)} />}
      
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
            releaseYear: selectedMovie.release_year ?? 0,
            country: selectedMovie.country,
            genre: selectedMovie.genres || '',
            recommendation_type: 'content',
            demographic_segment: '',
            gender: '',
            age_group: '',
            created_at: new Date().toISOString(),
          }}
          onClose={() => setSelectedMovie(null)}
          onSelectMovie={(m) => handleMovieClick({
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
          })}
        />
      )}
    </>
  );
};

export default HomePage;

// ---------- Styled Components ----------
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    font-family: 'Helvetica Neue', sans-serif;
    background-color: #141414;
    color: #fff;
  }
  ::-webkit-scrollbar { width: 0px; background: transparent; }
  * { scrollbar-width: none; }
  body { -ms-overflow-style: none; }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #141414;
  color: #fff;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const WelcomeText = styled.span`
  font-size: 1rem;
`;

const LogoutButton = styled.button`
  background: #3b82f6;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #2563eb; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const SearchButton = styled.button`
  background: transparent;
  color: white;
  border: 1px solid white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover { background: #333; }
`;

const AdminButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  &:hover { background: #2563eb; }
`;

const PrivacyLink = styled.span`
  color: #90caf9;
  font-size: 0.75rem;
  text-decoration: underline;
  cursor: pointer;
  text-align: center;
  &:hover {
    color: #bbdefb;
  }
`;

const HeroSection = styled.section`
  background-image: url('https://wallpaperaccess.com/full/329583.jpg');
  background-size: cover;
  background-position: center;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 60px;
  width: 100%;
  box-sizing: border-box;
`;

const HeroContent = styled.div`
  max-width: 600px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 8px;
  backdrop-filter: blur(3px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
`;

const HeroTitle = styled.h2`
  font-size: 3rem;
  margin-bottom: 20px;
  color: white;
`;

const HeroDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
`;

const PlayButton = styled.button`
  padding: 10px 20px;
  background: white;
  color: black;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  &:hover { background: #e5e5e5; }
`;

const MainContent = styled.main`
  padding: 40px 60px;
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #3b82f6;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 20px;
  background-color: #141414;
  margin-top: auto;
`;

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: black;
  color: white;
  font-size: 1.5rem;
`;

const LogoImg = styled.img`
  height: 60px;
  width: auto;
  cursor: pointer;
  @media (max-width: 600px) { height: 45px; }
`;

const RecommendationWrapper = styled.div`
  margin-bottom: 60px;
`;

const RecommendationBox = styled.div`
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 20px;
  margin-top: 10px;
`;

const RecommendationDescription = styled.p`
  color: #ccc;
  margin-bottom: 20px;
  font-size: 1.1rem;
`;

const EmptyStateContainer = styled.div`
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  margin-top: 20px;
`;

const EmptyStateText = styled.p`
  color: #ccc;
  margin-bottom: 20px;
  font-size: 1.1rem;
`;

const EmptyStateList = styled.ul`
  text-align: left;
  max-width: 500px;
  margin: 0 auto 20px auto;
  padding-left: 20px;
`;

const EmptyStateListItem = styled.li`
  color: #aaa;
  margin-bottom: 8px;
`;

const ErrorMessage = styled.div`
  background-color: rgba(59, 130, 246, 0.2);
  color: #fff;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  border: 1px solid #3b82f6;
`;
const FooterLink = styled(Link)`
  margin-left: 16px;
  color: #888;
  font-size: 0.9rem;
  text-decoration: underline;
  &:hover {
    color: #fff;
  }
`;

// Add these new styled components for the infinite scroll section
const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const MovieCard = styled.div`
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;

const MoviePoster = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 6px;
`;

const MovieTitle = styled.div`
  font-size: 0.9rem;
  margin-top: 8px;
  color: #fff;
  font-weight: 500;
`;

const MovieMeta = styled.div`
  font-size: 0.8rem;
  color: #aaa;
`;

const LoadingMore = styled.div`
  text-align: center;
  padding: 20px;
  color: #aaa;
  font-size: 0.9rem;
`;

const ExploreDescription = styled.p`
  color: #aaa;
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 1rem;
`;

const PrivacyLinkContainer = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;
