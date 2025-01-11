import { format } from "date-fns";
import { axiosInstance } from "./axios";

export type PostDataRequest = {
    title: string;
    published_at?: Date;
    is_published?: boolean;
    content: string;
}

export const fetchPosts = async ({page}: {page: number}) => {
    return await axiosInstance.get(`http://localhost/api/admin/posts`, {
        params: { page }
    });
}

export const fetchPost = async ({id}: {id: number}) => {
    return await axiosInstance.get(`http://localhost/api/admin/posts/${id}`);
}

export const createPost = async (data: PostDataRequest) => {
    return await axiosInstance.post('http://localhost/api/admin/posts', {
        ...data,
        published_at: format(data.published_at, 'yyyy-MM-dd HH:mm:ss'),
    });
}

export const editPost = async ({id, data } : { id: number, data: PostDataRequest}) => {
    return await axiosInstance.patch(`http://localhost/api/admin/posts/${id}`, {
        ...data,
        published_at: format(data.published_at, 'yyyy-MM-dd HH:mm:ss'),
    });
}