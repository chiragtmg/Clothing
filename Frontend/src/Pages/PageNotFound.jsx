import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
	const navigate = useNavigate();
	return (
		<div>
			<h2>404 PageNotFound</h2>
			<button onClick={() => navigate("/")}>Home</button>
		</div>
	);
};

export default PageNotFound;
