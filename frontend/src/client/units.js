import axios from "axios";
import env from "react-dotenv";
import { objectToUrlQueryString } from "../utils";

const baseURL = env.REACT_APP_API_URL;

export async function getUnits(params = {}) {
    const endpoint = objectToUrlQueryString(`${baseURL}/casetas/unidades/`, params);
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
