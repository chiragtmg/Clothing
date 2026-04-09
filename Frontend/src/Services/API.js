import axios from "axios";
import { toast } from "react-toastify";

// frontend and backend connection with axios
export const apiRequest = axios.create({
	baseURL: "http://localhost:4000/api",
	withCredentials: true,
});

// Google auth function (POST)
export const googleAuth = (code) => apiRequest.post("/auth/google", { code });

export const imgBaseURL = "http://localhost:4000";

// apiRequest.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       return Promise.reject(error);   // Silent reject
//     }
//     if (error.response?.status === 403) {
//       console.warn("Access denied (403)");
//     }
//     return Promise.reject(error);
//   }
// );
