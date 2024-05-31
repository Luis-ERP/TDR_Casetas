import axios from "axios";
import env from "react-dotenv";
import { objectToUrlQueryString } from "../utils";

const baseURL = env.REACT_APP_API_URL;

export async function getCruces(params = {}) {
    const endpoint = objectToUrlQueryString(`${baseURL}/casetas/cruces`, params);
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getCrucesByUnidad(params = {}) {
    const endpoint = objectToUrlQueryString(`${baseURL}/casetas/cruces/unidad`, params);
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getCrucesByOrden(params = {}) {
    const endpoint = objectToUrlQueryString(`${baseURL}/casetas/cruces/orden`, params);
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getCrucesByCaseta(params = {}) {
    const endpoint = objectToUrlQueryString(`${baseURL}/casetas/cruces/caseta`, params);
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
