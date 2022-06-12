import FormLogin from "../components/login/FormLogin";
import Card from "../components/layout/Card";
import Layout from "../components/layout/Layout";

const Home: React.FC = () => {
    return (
        <Layout>
            <Card>
                <FormLogin />
            </Card>
        </Layout>
    );
};

export default Home;
