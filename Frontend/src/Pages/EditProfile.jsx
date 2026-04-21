import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../Services/API";
import { getImageUrl } from "../utils/getImageUrl";

const EditProfile = () => {
	const { updateUser, currentUser } = useContext(AuthContext);
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(
		getImageUrl(currentUser?.avatar)
	);
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		username: currentUser?.username || "",
	});

	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

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
				}
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
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
			<div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
				<div className="bg-gradient-to-r from-indigo-600 to-purple-600 pt-10 pb-6 px-8 text-center">
					<div className="relative mx-auto w-32 h-32">
						<img
							src={previewUrl}
							alt="Profile"
							className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
						/>
						<label
							htmlFor="avatar-upload"
							className="absolute bottom-1 right-1 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-5 h-5 text-gray-700"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
								/>
							</svg>
						</label>
						<input
							id="avatar-upload"
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="hidden"
						/>
					</div>

					<h2 className="mt-6 text-2xl font-semibold text-white">
						Edit Profile
					</h2>
				</div>

				<div className="p-8">
					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-8">
						<div>
							<label className="block text-sm font-medium text-gray-500 mb-1">
								Email Address
							</label>
							<div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl text-gray-700">
								{currentUser?.email}
							</div>
							<p className="text-xs text-gray-400 mt-1">
								Email cannot be changed
							</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-500 mb-1">
								Role
							</label>
							<div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl text-gray-700">
								{currentUser?.role}
							</div>
							
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
								className="block w-full px-5 py-3.5 rounded-2xl border border-gray-300 
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 
                           outline-none transition-all duration-200 bg-white"
								placeholder="Enter username"
							/>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 
                ${isLoading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md hover:shadow-lg"
                }`}
						>
							{isLoading ? "Updating Profile..." : "Save Changes"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditProfile;