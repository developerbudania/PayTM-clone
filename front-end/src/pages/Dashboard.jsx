import {useEffect, useState} from "react"
import {Appbar} from "../components/Appbar"
import {Balance} from "../components/Balance"
import {Users} from "../components/Users"
import axios from "axios"
import {useNavigate} from "react-router-dom"

export const Dashboard = () =>{
    const [bal, setBal] = useState()
    const navigate = useNavigate();

useEffect(() => {
    const userToken = localStorage.getItem("token");
    if(!userToken){
        navigate("/signin")
    }
    else{
         const fetchBalance = async () => {
    const response = await axios.get("http://localhost:4000/api/v1/account/balance", {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    });

    setBal(response.data.balance);
};
fetchBalance();
    }
},[navigate]);

    return <div>
        <Appbar/>
        <div className = "m-8">
            <Balance value = {bal}/>
            <Users/>
        </div>
    </div>
}