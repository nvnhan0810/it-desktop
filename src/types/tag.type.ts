import { Post } from "./post.type";

export type TagItemResponse = Tag & {
    public_posts_count?: number;
}

export type Tag = {
    id: number;
    slug: string;
    name: string;
    posts_count?: number;
    post?: Post[];
}