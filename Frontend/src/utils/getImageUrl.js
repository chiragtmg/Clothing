import { imgBaseURL } from "../Services/API";

export const getImageUrl = (path) => {
	if (!path) return `${imgBaseURL}/images/placeholder.jpg`;

	// already full URL (cloudinary etc.)
	if (path.startsWith("http")) return path;

	return `${imgBaseURL}${path}`;
};