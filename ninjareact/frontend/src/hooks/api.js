import Cookies from "universal-cookie"

const session = async () => {
    const response = await fetch("/api/session", {
        contentType: "application/json",
        credentials: "same-origin"
    });

    return await response.json();
}

const login = async (username, password) => {
    const cookies = new Cookies(null, { path: '/'})

    const response = await fetch("/api/login", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": cookies.get("csrftoken")
        },
        credentials: "same-origin",
        body: JSON.stringify({ username, password})
    });

    return await response.json();

}

const logout = async () => {
    const response = await fetch("/api/logout", {
        credentials:"same-origin"
    });

    return response.json();
}

const sendMessage = async (message) => {
    const cookies = new Cookies(null, { path: '/'})

    const response = await fetch("/api/message", {
        method: "put",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": cookies.get("csrftoken")
        },
        credentials: "same-origin",
        body: JSON.stringify({ new_message: message })
    });

    return await response.json();
}

export default { session, login, logout, sendMessage }