import { imgBaseURL } from "../Services/API";

export const getImageUrl = (path) => {
	if (!path) return `${imgBaseURL}/images/placeholder.jpg`;

	if (path.startsWith("http")) return path;

	return `${imgBaseURL}${path}`;
};