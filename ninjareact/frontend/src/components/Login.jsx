import {useState} from "react";
import useAuthStore from "../stores/auth.jsx";
import Api from "../hooks/api.js";
import {useNavigate} from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("");

    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = await Api.login(username, password);
        if (!data.username) {
            setError(data.error);
            return;
        }

        login(data.username);
        navigate("/dashboard");
    }

    return (
        <div className="flex flex-col items-center bg-gray-100 px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow max-w-md mt-10">
                <div className="p-6 space-y-4">
                    <h1 className="text-xl font-bold">Sign In</h1>
                    {error && <div className="alert alert-error">{error}</div>}
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email"
                                   className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                            <input type="text" name="username" id="username"
                                   className="input input-bordered"
                                   value={username} onChange={(e) => setUsername(e.target.value)}
                                   required/>
                        </div>
                        <div>
                            <label htmlFor="password"
                                   className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                            <input type="password" name="password" id="password"
                                   className="input input-bordered"
                                   value={password} onChange={(e) => setPassword(e.target.value)}
                                   required/>
                        </div>

                        <button type="submit" className="btn btn-primary">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    )

}

export default Login;