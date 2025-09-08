 import{useEffect, useState} from "react"
 import axios from "axios"
 import {Button} from "./Button"
 import {Link, useNavigate} from "react-router-dom"
 export const Appbar = () =>{
    const [user, setUser] = useState();
    const navigate = useNavigate();

useEffect(() => {
    const userToken = localStorage.getItem("token");
    
    if(!userToken) {
        navigate("/signin");
    }
    else{
        const fetchUser = async () => {
            const response = await axios.get("https://pay-tm-clone-ebon.vercel.app/api/v1/user/getuser", {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            setUser(response.data);
        };
         fetchUser();
    }
},[]);
const signOutHandler = ()=>{
    localStorage.removeItem("token");
    navigate("/signin");
}

    return <div className="shadow h-14 flex justify-between items-center md:px-10">
        <Link to = {"/dashboard"}> 
        <div className="flex flex-col justify-center h-full ml-4 font-bold">
            PayTM App 
        </div>
        </Link>
        <div className="flex items-center justify-center pt-2.5 gap-2">
             <Button label={"Sign Out"} onClick={signOutHandler} />
            <div className="flex flex-col justify-center h-full mb-2 mr-4">
                {user?.firstName}
            </div>
            <div className="rounded-full h-10 w-10 p-4 bg-slate-200 flex justify-center mb-2.5 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user?.firstName[0].toUpperCase()}
                </div>
            </div>
        </div>
    </div>
 }