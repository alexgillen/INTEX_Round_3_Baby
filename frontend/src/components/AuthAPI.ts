// AuthAPI.ts - Functions for authentication

// Use the environment variable for the API URL
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

interface LogoutRequest {
  sessionId: string;
}

interface LogoutResponse {
  success: boolean;
}

// Helper to get the session ID from localStorage
const getSessionId = (): string | null => {
  return localStorage.getItem('sessionId');
};

export const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Not logged in');
    }

    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // Clear local storage regardless of server response
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  } catch (error) {
    console.error('Logout error', error);
    // Still clear local storage on error
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    throw error;
  }
};