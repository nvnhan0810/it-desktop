import { PostEditPage } from "@/pages/posts/edit";
import { PostNewPage } from "@/pages/posts/new";
import { TagListPage } from "@/pages/tags";
import { createHashRouter } from "react-router-dom";
import { IndexPage } from "../pages";

export const router = createHashRouter([
    {
        path: '/',
        element: <IndexPage />
    },
    {
        path: '/posts/new',
        element: <PostNewPage />
    },
    {
        path: '/posts/:id/edit',
        element: <PostEditPage />
    },
    {
        path: '/tags',
        element: <TagListPage />
    }
])