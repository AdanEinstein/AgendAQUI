import useAuth from "../auth/useAuth"
import Card from "../components/layout/Card"
import Layout from "../components/layout/Layout"

const Home: React.FC = () => {
    useAuth()    

    return (
        <Layout links={["Home", "Agenda"]}>
            <Card>
                
            </Card>
        </Layout>
    )
}

export default Home