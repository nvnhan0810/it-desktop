import { cn } from "@/lib/utils";
import { Post } from "@/types/post.type";
import { isBefore } from "date-fns";
import { Link } from "react-router-dom";
import TagBadge from "./tag-badge";

const PostListItem = ({ post }: {post: Post}) => {
    const notPublished = !post.isPublished || isBefore(new Date(), post.publishedDate);

    return (
        <Link to={`/posts/${post.id}/edit`} className={cn(
            "block border rounded-lg p-4 shadow-sm hover:shadow-md transition",
            {
                "bg-gray-200 dark:bg-zinc-900": notPublished,
            }
        )}>
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-gray-700 dark:text-gray-500 break-all">{post.content.substring(0, 100)}...</p>
            {post.tags != undefined && post.tags.length > 0
                ? (
                    <div className="flex gap-2 overflow-hidden mt-3">
                        {post.tags.map((item) => <TagBadge key={item.id} tag={item} classes={cn(
                            'text-[0.5rem]',
                            {
                                'bg-white': notPublished
                            }
                        )} useLink={false} />)}
                    </div>
                )
                : <></>}
        </Link>
    );
}

export default PostListItem;