// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://new-fabritech.vercel.app/api';

// Debug: Log the API URL being used (remove in production if needed)
console.log('API Base URL:', API_BASE_URL);

export default API_BASE_URL;

