import {useEffect, useState} from "react";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Api from "@/hooks/api.js";
import useAuthStore from "@/stores/auth.jsx";
import Layout from "@/Layout.jsx";
import Login from "@/components/Login.jsx";
import Dashboard from "@/components/Dashboard.jsx";

const PrivateRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return isAuthenticated ? children : <Navigate to={"/login"} />;
}

const DefaultRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return isAuthenticated ? <Navigate to={"/dashboard"} /> : <Navigate to={"/login"} />;
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <DefaultRoute />,
            },
            {
                path: "/login",
                element: <Login/>
            },
            {
                path: "/dashboard",
                element: <PrivateRoute><Dashboard /></PrivateRoute>,
            },
        ]
    },
]);

const App = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        const getSession = async () => {
            const session = await Api.session();

            if (session.isAuthenticated) {
                login(session.username);
            }

            setIsInitialized(true);
        }

        getSession();
    }, []);

    return isInitialized ? <RouterProvider router={router} /> : <></>
}

export default App;