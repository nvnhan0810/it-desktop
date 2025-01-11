import { Post } from "@/types/post.type";
import { Link } from "react-router-dom";
import TagBadge from "./tag-badge";

const PostListItem = ({ post }: {post: Post}) => {
    return (
        <Link to={`/posts/${post.id}/edit`} className="block border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-gray-700">{post.content.substring(0, 100)}...</p>
            {post.tags != undefined && post.tags.length > 0
                ? (
                    <div className="flex gap-2 overflow-hidden mt-3">
                        {post.tags.map((item) => <TagBadge key={item.id} tag={item} classes="text-[0.5rem]" useLink={false} />)}
                    </div>
                )
                : <></>}
        </Link>
    );
}

export default PostListItem;