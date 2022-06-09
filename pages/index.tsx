import FormLogin from "../components/login/FormLogin";
import FormCadastroLogin from "../components/new-login/FormCadastroLogin"
import Card from "../components/layout/Card";
import Layout from "../components/layout/Layout";

const Home: React.FC = () => {
    return (
        <Layout>
            <Card>
                <FormLogin />
                {/* <FormCadastroLogin/> */}
            </Card>
        </Layout>
    );
};

export default Home;
