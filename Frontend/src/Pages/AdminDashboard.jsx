import { useEffect, useState } from "react";
import { apiRequest } from "../../Services/API";
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

	const [genderData, setGenderData] = useState({ men: 0, women: 0 });
	const [monthlySales, setMonthlySales] = useState([]);

	// Fetch Analytics Data
	useEffect(() => {
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
				toast.error("Failed to load dashboard data");
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	// Pie Chart Data (Men vs Women)
	const pieData = {
		labels: ["Men", "Women"],
		datasets: [
			{
				data: [genderData.men, genderData.women],
				backgroundColor: ["#3b82f6", "#ec4899"],
				hoverBackgroundColor: ["#1e40af", "#be185d"],
				borderWidth: 0,
			},
		],
	};

	const pieOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom",
				labels: { padding: 20, font: { size: 14 } },
			},
		},
	};

	// Bar Chart Data (Monthly Sales)
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
			y: { beginAtZero: true, ticks: { callback: (value) => `NPR ${value}` } },
		},
	};

	if (loading) {
		return (
			<div className="text-center py-20 text-xl">Loading Dashboard...</div>
		);
	}

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

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
			</div>
		</div>
	);
};

export default AdminDashboard;
