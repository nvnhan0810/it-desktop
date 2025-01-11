import { fetchPosts } from "@/apis/post.apis";
import PostListItem from "@/components/post-list-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Post } from "@/types/post.type";
import { CirclePlus, CircleUser, Hash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const IndexPage = () => {
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        handleFetchPosts();
    }, [page]);

    const handleFetchPosts = async () => {
        const res = await fetchPosts({ page });

        if (res.status == 200) {
            if (page === 1) {
                setPosts([...res.data.data]);
            } else {
                setPosts([
                    ...posts,
                    ...res.data.data,
                ]);
            }
        }
    }

    return (
        <div className="py-3 px-4">
            <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex gap-2 items-center">
                    <Link to="/posts/new">
                        <CirclePlus size={20} />
                    </Link>
                    <Link to="/tags">
                        <Hash size={20} />
                    </Link>

                    
                </div>
                <div className="flex items-center gap-2">
                    <div className="max-w-96 min-w-96">
                        <Input placeholder="Tìm kiếm" />
                    </div>
                    <Link to="/login">
                        <CircleUser size={20} />
                    </Link>
                </div>
            </div>

            <div className="grid gap-3 grid-cols-4 mb-4">
                {posts.map((item) => {
                    return <PostListItem key={item.id} post={item} />
                })}
            </div>

            <div className="flex items-center justify-center">
                <Button type="button" onClick={() => setPage(page +1)}>Tải thêm</Button>
            </div>
        </div>
    );
}