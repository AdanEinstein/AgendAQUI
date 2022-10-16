import React from "react"
import LayoutConta from "../components/conta/LayoutConta"
import UserProvider, { useUser } from "../contexts/UserContext"


const Conta: React.FC = () => {
    return (
        <UserProvider>
            <LayoutConta></LayoutConta>
        </UserProvider>
    )
}

export default Conta