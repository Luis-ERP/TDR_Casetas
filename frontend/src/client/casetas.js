import axios from "axios";
import env from "react-dotenv";
import { objectToUrlQueryString } from "../utils";

const baseURL = env.REACT_APP_API_URL;

export async function getCasetas(params = {}) {
    const endpoint = objectToUrlQueryString(`${baseURL}/casetas/casetas/`, params);
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function updateCaseta(casetaId, data) {
    try {
        const response = await axios.patch(`${baseURL}/casetas/casetas/${casetaId}/`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function createCaseta(data) {
    try {
        const response = await axios.post(`${baseURL}/casetas/casetas/`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function deleteCaseta(casetaId) {
    try {
        const response = await axios.delete(`${baseURL}/casetas/casetas/${casetaId}/`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
