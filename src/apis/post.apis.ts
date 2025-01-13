import { Config } from "@/config";
import { User } from "@/types/user.type";
import { format } from "date-fns";
import { axiosInstance } from "./axios";

export type PostDataRequest = {
    title: string;
    tags: string;
    published_at?: Date;
    is_published?: boolean;
    content: string;
}

export const fetchPosts = async ({user, page, search}: {user: User | null, page: number, search: string}) => {
    let url = `${Config.api.baseUrl}/posts`;

    if (user) {
        url = `${Config.api.baseUrl}/admin/posts`;
    }
    return await axiosInstance.get(url, {
        params: { page, search }
    });
}

export const fetchPost = async ({id}: {id: number}) => {
    return await axiosInstance.get(`${Config.api.baseUrl}/admin/posts/${id}`);
}

export const createPost = async (data: PostDataRequest) => {
    return await axiosInstance.post(`${Config.api.baseUrl}/admin/posts`, {
        ...data,
        published_at: format(data.published_at, 'yyyy-MM-dd HH:mm:ss'),
        tags: (data.tags ?? '').split(','),
    });
}

export const editPost = async ({id, data } : { id: number, data: PostDataRequest}) => {
    return await axiosInstance.patch(`${Config.api.baseUrl}/admin/posts/${id}`, {
        ...data,
        published_at: format(data.published_at, 'yyyy-MM-dd HH:mm:ss'),
        tags: (data.tags ?? '').split(','),
    });
}