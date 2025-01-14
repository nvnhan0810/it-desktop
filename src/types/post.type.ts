import { Tag } from "./tag.type";

export type PostItemResponse = Post & {
    public_tags?: Tag[];
    is_published?: boolean;
    published_at: string;
}

export type Post = {
    id: number;
    slug: string;
    title: string;
    content: string;
    tags?: Tag[];
    isPublished: boolean;
    publishedDate: Date;
}