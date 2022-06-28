import { useRouter } from "next/router"
import { useEffect } from "react"
import useAuth from "../auth/useAuth"
import Card from "../components/layout/Card"
import Layout from "../components/layout/Layout"

const Home: React.FC = () => {
    const auth = useAuth()
    const route = useRouter()

    useEffect(() => {
        !auth && route.push('/not_found') 
    }, [])

    return (
        <Layout links={["Home", "Agenda"]}>
            <Card>
                
            </Card>
        </Layout>
    )
}

export default Home