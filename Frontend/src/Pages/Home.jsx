import HeroBanner from "../Components/HeroBanner";
import LatestCollections from "../Components/LatestCollections";

const Home = () => {
	return (
		<main className="min-h-screen bg-gray-50">
			<HeroBanner />
			<LatestCollections />
		</main>
	);
};

export default Home;
