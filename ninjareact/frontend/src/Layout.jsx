import { Outlet, useNavigate } from "react-router-dom";
import Api from '@/hooks/api.js'
import useAuthStore from "@/stores/auth.jsx";
import { useShallow } from "zustand/react/shallow";

const Layout = () => {
    const navigate = useNavigate();
    const { isAuthenticated, username, logout } = useAuthStore(
        useShallow((state) => ({
            isAuthenticated: state.isAuthenticated,
            username: state.username,
            logout: state.logout
        }))
    );

    const handleLogout = async (e) => {
        e.preventDefault();
        await Api.logout();

        logout();
        navigate("/");
    }

    return (
        <>
            <header>
                <div className="navbar bg-primary text-primary-content">
                    <div className="flex-1">
                        <a className="btn btn-ghost text-xl">Django Ninja & React</a>
                    </div>
                    <div className="flex-none">
                        <ul className="menu menu-horizontal px-1">
                            {isAuthenticated &&
                                <li>
                                    <details>
                                        <summary>My Account</summary>
                                        <ul className="bg-base-100 rounded-t-none p-2 text-black">
                                            <li><a>{username}</a></li>
                                            <li><a onClick={handleLogout}>Logout</a></li>
                                        </ul>
                                    </details>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </header>
            <main>
                <Outlet/>
            </main>
        </>
    )
}

export default Layout;