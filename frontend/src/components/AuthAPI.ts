// AuthAPI.ts - Functions for authentication

// Use HTTPS in production, HTTP in development
const isDevelopment = window.location.hostname === 'localhost';
const API_URL = isDevelopment 
  ? "http://intex-group3-13-backend-deploy-anb0acagfxbqcthh.eastus-01.azurewebsites.net//api/auth"
  : "https://intex-group3-13-backend-deploy-anb0acagfxbqcthh.eastus-01.azurewebsites.net//api/auth"; // Path to auth controller

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

export const logout = async (): Promise<LogoutResponse> => {
  try {
    // Clear auth data from localStorage immediately
    localStorage.removeItem('authToken');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    localStorage.removeItem('userMovieRatings');
    
    // If we have a sessionId, try to revoke it on the server, but don't make it required
    const sessionId = getSessionId();
    
    if (sessionId) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId } as LogoutRequest)
        });
      } catch (e) {
        // Ignore server errors during logout - we've already cleared local storage
        console.log("Could not revoke session on server, but local logout succeeded");
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error during logout:", error);
    // Still return success since we've cleared localStorage
    return { success: true };
  }
};