import { Config } from "@/config";
import { axiosInstance } from "./axios";

export const fetchUserProfile = async () => {
    return await axiosInstance.get(`${Config.auth.baseUrl}/api/user`);
}