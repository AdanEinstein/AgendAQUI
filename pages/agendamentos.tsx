import React from "react";
import LayoutAgendamentos from "../components/agendamentos/LayoutAgendamentos";
import UserProvider from "../contexts/UserContext";

const Agendamentos: React.FC = () => {
	return (
		<UserProvider>
            <LayoutAgendamentos/>
		</UserProvider>
	);
};

export default Agendamentos;
