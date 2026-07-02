import axios from "axios";

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: "https://e-commerce-api-3wara.vercel.app/",
})

// Add an interceptor to the Axios instance
api.interceptors.request.use(
  (config) => {
    // Get the user's token from local storage
    const token = localStorage.getItem("userToken")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config;
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
