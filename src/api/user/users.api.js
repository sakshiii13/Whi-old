import { Axios } from "../../constants/mainContent";

export const getProfile = async(role) => {
    try {
        const response = await Axios.get(`/${role}/user/profile`);
        return response?.data;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
}