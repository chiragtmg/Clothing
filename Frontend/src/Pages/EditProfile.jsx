import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiRequest } from "../Services/API";
import { getImageUrl } from "../utils/getImageUrl";

const EditProfile = () => {
	const { updateUser, currentUser } = useContext(AuthContext);
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(
		getImageUrl(currentUser?.avatar),
	);
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: currentUser?.username || "",
		email: currentUser?.email || "",
		avatar: currentUser?.avatar || "",
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	// console.log(currentUser);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];

		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			setError("Image must be less than 5MB");
			return;
		}

		setSelectedFile(file);
		setPreviewUrl(URL.createObjectURL(file));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const submitData = new FormData();

			submitData.append("username", formData.username);
			submitData.append("email", formData.email);

			if (selectedFile) {
				submitData.append("avatar", selectedFile);
			}

			const res = await apiRequest.put(
				`/user/edit/${currentUser._id}`,
				submitData,
				{
					headers: {
						Authorization: `Bearer ${currentUser?.token}`,
					},
				},
			);

			updateUser(res.data.data);
			navigate("/");
		} catch (error) {
			setError(error.response?.data?.msg || "Something went wrong");
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold text-gray-900 tracking-tight">
						Edit Profile
					</h2>
					<p className="mt-2 text-sm text-gray-600">Edit Your Profile</p>
				</div>
				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-5">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Email address
							</label>
							<input
								id="email"
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="block w-full px-4 py-3 rounded-lg border border-gray-300 
                           placeholder:text-gray-400 
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 
                           outline-none transition-all duration-200"
							/>
						</div>

						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Username
							</label>
							<input
								id="username"
								type="text"
								name="username"
								value={formData.username}
								onChange={handleChange}
								className="block w-full px-4 py-3 rounded-lg border border-gray-300 
                           placeholder:text-gray-400 
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 
                           outline-none transition-all duration-200"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Profile Image
							</label>

							{previewUrl && (
								<img
									src={previewUrl}
									alt="Preview"
									className="w-24 h-24 rounded-full object-cover mb-3 border"
								/>
							)}

							<input
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="block w-full text-sm text-gray-500"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 ${
							isLoading ? "opacity-70 cursor-not-allowed" : ""
						}`}
					>
						{isLoading ? "Updating Account..." : "Save"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default EditProfile;
