import axios from "axios";
import { toast } from "react-toastify";

export const apiRequest = axios.create({
	baseURL: "http://localhost:4000/api",
	withCredentials: true,
});

export const googleAuth = (code) => apiRequest.post("/auth/google", { code });

export const imgBaseURL = "http://localhost:4000";
