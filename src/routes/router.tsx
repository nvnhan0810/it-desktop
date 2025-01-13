import AuthGuard from "@/guards/authGuard";
import DefaultLayout from "@/layouts";
import { IndexPage } from "@/pages/index";
import { PostEditPage } from "@/pages/posts/edit";
import { PostNewPage } from "@/pages/posts/new";
import { createHashRouter } from "react-router-dom";

export const router = createHashRouter([
    {
        path: '/', 
        element: <DefaultLayout />,
        children: [
            {
                index: true,
                element: <IndexPage/>
            },
            {
                path: '/posts/new',
                element: (
                    <AuthGuard>
                        <PostNewPage />
                    </AuthGuard>
                ),
            },
            {
                path: '/posts/:id/edit',
                element: (
                    <AuthGuard>
                        <PostEditPage />
                    </AuthGuard>
                )
            },
            {
                path: '/tags',
            }
        ]
    }
])