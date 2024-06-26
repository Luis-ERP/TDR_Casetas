import axios from "axios";
import env from "react-dotenv";
import { objectToUrlQueryString } from "../utils";

const baseURL = env.REACT_APP_API_URL;

export async function getOrders(params = {}) {
    const endpoint = objectToUrlQueryString(`${baseURL}/casetas/ordenes/`, params);
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function createRawOrder(data) {
    const response = await axios.post(`${baseURL}/casetas/ordenes/raw/`, data);
    return response.data;
}
