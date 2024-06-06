import axios from "axios";
import env from "react-dotenv";
import { objectToUrlQueryString } from "../utils";

const baseURL = env.REACT_APP_API_URL;

export async function getRutas(params = {}) {
    const endpoint = objectToUrlQueryString(`${baseURL}/casetas/rutas/`, params);
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function updateRuta(id, data) {
    try {
        const response = await axios.patch(`${baseURL}/casetas/rutas/${id}/`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function createRuta(data) {
    try {
        const response = await axios.post(`${baseURL}/casetas/rutas/`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function deleteRuta(id) {
    try {
        const response = await axios.delete(`${baseURL}/casetas/rutas/${id}/`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
