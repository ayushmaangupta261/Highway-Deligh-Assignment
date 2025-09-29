import React from 'react'
import { logOutUser } from "../../services/operations/authApi";
import logo from "../../assets/dashboard/logo.png"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const dispatch = useDispatch()
    const user = useSelector((state: any) => state.auth.user)
    const navigate = useNavigate();


    const signOutHandler = async () => {
        try {
            await logOutUser(dispatch);
        } catch (error) {
            console.log("Error during logout");

        }
    }

    return (
        < div className="flex justify-between items-center py-4 " >
            <div className="flex items-center space-x-4">
                <img src={logo} alt="logo" className="cursor-pointer w-10 h-10 object-contain" onClick={() => navigate("/")} />
                {
                    user ?
                        (<p className="text-lg font-semibold cursor-pointer">Dashboard</p>)
                        :
                        (<p className="text-lg font-semibold cursor-pointer" onClick={() => navigate("/")}>HD</p>)
                }
            </div>
            {user && <p className="text-[#367AFF] underline underline-offset-4 cursor-pointer" onClick={signOutHandler}>
                Sign Out
            </p>}
        </div >
    )
}

export default Navbar