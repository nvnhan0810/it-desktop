import { fetchPosts } from "@/apis/post.apis";
import AuthHeaderIcon from "@/components/auth-header-icon";
import PostListItem from "@/components/post-list-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/store/hooks";
import { Post, PostItemResponse } from "@/types/post.type";
import { parse } from "date-fns";
import { CirclePlus, Hash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const IndexPage = () => {
    const user = useAppSelector((state) => state.auth.user);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [search, setSearch] = useState('');
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        if (loading) {
            return;
        }

        handleFetchPosts();
    }, [page, lastPage, user, search]);

    const handleFetchPosts = async () => {
        setLoading(true);
        const res = await fetchPosts({ user, page, search });

        if (res.status == 200) {
            const data: Post[] = res.data.data.map((item: PostItemResponse) => {
                console.log(!!item.is_published);
                return {
                    ...item,
                    isPublished: !!item.is_published,
                    publishedDate: parse(item.published_at, 'yyyy-MM-dd hh:mm:ss', new Date()),
                }
            });
            if (page === 1) {
                setPosts([...data]);
            } else {
                setPosts([
                    ...posts,
                    ...data,
                ]);
            }
            setLastPage(res.data.last_page);
        }
        setLoading(false);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setPage(1);
            setLastPage(1);
            setSearch(event.currentTarget.value);
        }
    };

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
                        <Input placeholder="Tìm kiếm" onKeyDown={handleKeyDown} />
                    </div>
                    <AuthHeaderIcon />
                </div>
            </div>

            <div className="grid gap-3 grid-cols-4 mb-4">
                {posts.map((item) => {
                    return <PostListItem key={item.id} post={item} />
                })}
            </div>

            {page < lastPage && (
                <div className="flex items-center justify-center">
                    <Button type="button" onClick={() => setPage(page +1)}>Tải thêm</Button>
                </div>
            )}
        </div>
    );
}