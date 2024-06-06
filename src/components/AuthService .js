import axios from 'axios';

const AuthService = {
  // Assuming you have a route on the server to fetch current user information
  getCurrentUser: async () => {
    try {
      const response = await axios.get('/users/details'); // Example route to fetch current user
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }
};

export default AuthService;
