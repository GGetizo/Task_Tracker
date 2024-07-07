import axios from 'axios';

// Set the base URL if needed
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000', // Update with your backend URL
    withCredentials: true // Ensure this is set if needed
});

export default axiosInstance;