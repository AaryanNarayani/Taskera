import { BASE_URL } from "@/utils/vars";
import axios from "axios";

export function Redirect() {
    try{
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    console.log('Token :', token);
    localStorage.setItem('token', token || '');
    async function checkOnboarded (){
    try{
        const user = await axios.get(`${BASE_URL}/api/v1/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if(user.data.user.isOnboarded === false){
            window.location.href = `http://localhost:5173/details`;
        }
        else {
            window.location.href = `http://localhost:5173/home`;
        }
    }catch(e){
        console.log("Error :",e);
        window.location.href = `http://localhost:5173/signup`;
    }
    }
    checkOnboarded();
    
}catch(error) {
    window.location.href = `http://localhost:5173/signup`;
    console.error('Error parsing URL parameters:', error);
}
    
    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-2xl font-bold">Redirecting...</h1>
        </div>
    );
}