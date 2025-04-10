// File: /frontend/src/api/RecommendationAPI.ts
import { Movie } from '../types/Movie';

/**
 * Interface for movie recommendation objects
 */
export interface MovieRecommendation {
  show_id: string;
  title: string;
  type: string;
  demographic_segment: string;
  gender: string;
  age_group: string;
  genre: string;
  recommendation_type: string;
  created_at: string;
  posterUrl?: string;
  director?: string;
  cast?: string;
  description?: string;
  rating?: string;
  duration?: string;
  releaseYear?: number;
  country?: string;
}

/**
 * Response structure for collaborative filtering recommendations
 */
export interface CollaborativeRecommendationsResponse {
  recommendations: MovieRecommendation[];
}

/**
 * Response structure for all recommendations grouped by category
 */
export interface AllRecommendationsResponse {
  recommendations: Record<string, MovieRecommendation[]>; // Category -> Recommendations
}

// Use the environment variable for the API URL
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/Recommendation`;

// Helper to get the auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Get collaborative filtering recommendations
export const fetchCollaborativeRecommendations = async (): Promise<MovieRecommendation[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/collaborative`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: CollaborativeRecommendationsResponse = await response.json();
    return data.recommendations;
  } catch (error) {
    console.error("Error fetching collaborative recommendations:", error);
    throw error;
  }
};

// Get content-based recommendations 
export const fetchContentBasedRecommendations = async (): Promise<MovieRecommendation[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/content-based`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: CollaborativeRecommendationsResponse = await response.json();
    return data.recommendations;
  } catch (error) {
    console.error("Error fetching content-based recommendations:", error);
    throw error;
  }
};

// Get all recommendations by category
export const fetchAllRecommendations = async (limit: number = 10): Promise<Record<string, MovieRecommendation[]>> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/all?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }

    const data: AllRecommendationsResponse = await response.json();
    return data.recommendations;
  } catch (error) {
    console.error("Error fetching all recommendations:", error);
    throw error;
  }
};