import { useContext, useEffect, useState } from "react";
import { apiRequest } from "../Services/API";
import { toast } from "react-toastify";
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SideBar from "../Components/SideBar";   // ← Import Sidebar

ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
);

const AdminDashboard = () => {
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		totalOrders: 0,
		totalRevenue: 0,
		totalCustomers: 0,
		totalProducts: 0,
	});
	const navigate = useNavigate();
	const { isLoggedIn, isAdmin, currentUser, loading: authLoading } = useAuth();
	const [genderData, setGenderData] = useState({ men: 0, women: 0 });
	const [monthlySales, setMonthlySales] = useState([]);

	// Fetch Analytics Data
	useEffect(() => {
		if (authLoading) return;

		if (!isLoggedIn || !isAdmin) {
			toast.error(!isLoggedIn ? "Please login first" : "Access denied. Admin only.");
			navigate(!isLoggedIn ? "/login" : "/");
			return;
		}

		const fetchDashboardData = async () => {
			try {
				setLoading(true);
				const res = await apiRequest.get("/admin/analytics");

				setStats({
					totalOrders: res.data.totalOrders || 0,
					totalRevenue: res.data.totalRevenue || 0,
					totalCustomers: res.data.totalCustomers || 0,
					totalProducts: res.data.totalProducts || 0,
				});

				setGenderData({
					men: res.data.genderDistribution?.men || 65,
					women: res.data.genderDistribution?.women || 35,
				});

				setMonthlySales(res.data.monthlySales || []);
			} catch (err) {
				console.error(err);
				if (err.response?.status === 404) {
					toast.error("Analytics endpoint not found. Please check backend routes.");
				} else {
					toast.error("Failed to load dashboard data");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, [isLoggedIn, isAdmin, authLoading, navigate]);

	// Pie Chart Data
	const pieData = {
		labels: ["Men's Category", "Women's Category"],
		datasets: [
			{
				data: [genderData.men, genderData.women],
				backgroundColor: ["#3b82f6", "#ec4899"],
				hoverBackgroundColor: ["#1e40af", "#be185d"],
				borderWidth: 2,
				borderColor: "#ffffff",
			},
		],
	};

	const pieOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom",
				labels: {
					padding: 25,
					font: { size: 15 },
					usePointStyle: true,
				},
			},
			tooltip: {
				callbacks: {
					label: (context) => `${context.label}: ${context.raw} items sold`,
				},
			},
		},
	};

	// Bar Chart Data
	const barData = {
		labels: monthlySales.length
			? monthlySales.map((item) => item.month)
			: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
		datasets: [
			{
				label: "Sales (NPR)",
				data: monthlySales.length
					? monthlySales.map((item) => item.sales)
					: [45000, 62000, 38000, 71000, 89000, 55000],
				backgroundColor: "#10b981",
				borderColor: "#10b981",
				borderWidth: 2,
				borderRadius: 8,
			},
		],
	};

	const barOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			title: {
				display: true,
				text: "Monthly Sales Overview",
				font: { size: 18 },
			},
		},
		scales: {
			y: { 
				beginAtZero: true, 
				ticks: { callback: (value) => `NPR ${value.toLocaleString()}` } 
			},
		},
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-lg text-gray-600">Loading Dashboard...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
				<SideBar />

				<main className="p-6 md:p-8">
					<div className="flex items-center justify-between mb-8">
						<h1 className="text-3xl font-bold text-gray-900">
							Admin Dashboard
						</h1>
						<button className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition">
							Logout
						</button>
					</div>

					{/* Summary Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
						<div className="bg-white p-6 rounded-3xl shadow-sm">
							<p className="text-gray-500 text-sm">Total Orders</p>
							<p className="text-4xl font-bold mt-2">{stats.totalOrders}</p>
						</div>
						<div className="bg-white p-6 rounded-3xl shadow-sm">
							<p className="text-gray-500 text-sm">Total Revenue</p>
							<p className="text-4xl font-bold mt-2">
								NPR {stats.totalRevenue.toLocaleString()}
							</p>
						</div>
						<div className="bg-white p-6 rounded-3xl shadow-sm">
							<p className="text-gray-500 text-sm">Total Customers</p>
							<p className="text-4xl font-bold mt-2">{stats.totalCustomers}</p>
						</div>
						<div className="bg-white p-6 rounded-3xl shadow-sm">
							<p className="text-gray-500 text-sm">Total Products</p>
							<p className="text-4xl font-bold mt-2">{stats.totalProducts}</p>
						</div>
					</div>

					{/* Charts Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Pie Chart - Gender Distribution */}
						<div className="bg-white p-8 rounded-3xl shadow-sm">
							<h2 className="text-2xl font-semibold mb-6">Orders by Gender</h2>
							<div className="h-96">
								<Pie data={pieData} options={pieOptions} />
							</div>
						</div>

						{/* Bar Chart - Monthly Sales */}
						<div className="bg-white p-8 rounded-3xl shadow-sm">
							<h2 className="text-2xl font-semibold mb-6">Monthly Sales</h2>
							<div className="h-96">
								<Bar data={barData} options={barOptions} />
							</div>
						</div>
					</div>

					{/* You can add Recent Orders table here later */}
				</main>
			</div>
		</div>
	);
};

export default AdminDashboard;