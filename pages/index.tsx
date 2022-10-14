import FormLogin from "../components/login/FormLogin";
import Card from "../components/layout/Card";
import Layout from "../components/layout/Layout";
import { useEffect } from "react";

const Home: React.FC = () => {
    useEffect(() => {
        localStorage.clear()
    }, [])
    return (
        <Layout>
            <Card>
                <FormLogin />
            </Card>
        </Layout>
    );
};

export default Home;
