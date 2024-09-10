import useAuthStore from "@/stores/auth.jsx";
import {useState} from "react";
import Api from "@/hooks/api.js";

function Dashboard() {
    const username = useAuthStore((state) => state.username);
    const [message, setMessage] = useState("");
    const [result, setResult] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await Api.sendMessage(message);

        setResult(response.message);
    }

    return (
        <>
            <div className="m-5">
                <div className="alert alert-success">
                    You are logged in as: <strong>{username}</strong>
                </div>
            </div>
            <div className="m-5">
                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                            Send a message to the server
                        </label>
                        <input type="text" name="username" id="username" placeholder="Enter a message"
                               className="input input-bordered"
                               value={message} onChange={(e) => setMessage(e.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-primary">Send</button>
                </form>
            </div>
            {result ? <div className="m-5">{result}</div> : null}
        </>
    )
}

export default Dashboard