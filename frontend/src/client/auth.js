import axios from "axios";
import env from "react-dotenv";

const baseURL = env.REACT_APP_API_URL;

export async function login(username, password) {
    const response = await axios.post(`${baseURL}/casetas/login`, {
        username,
        password
    });
    const { token } = response.data;
    return token;
}
