import React from "react";
import LayoutHome from "../components/home/LayoutHome";
import UserProvider from "../contexts/UserContext";

const Home: React.FC = () => {
	return (
		<UserProvider>
			<LayoutHome />
		</UserProvider>
	);
};

export default Home;
