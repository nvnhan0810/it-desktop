import TagBadge from "@/components/tag-badge";
import { Input } from "@/components/ui/input";
import { CircleUser, Hash, Rss } from "lucide-react";
import { Link } from "react-router-dom";

export const TagListPage = () => {
    const tags = Array.from(Array(40), (e, index) => {
        return {
            id: 100 * (index + 1),
            name: `Tag ${index}`,
            slug: `slug-${index}`
        };
    });
    return (
        <div className="py-3 px-4">
            <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex gap-2 items-center">
                    <Link to="/">
                        <Rss size={20} />
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

            <div className="flex flex-wrap gap-3">
                {tags.map((item) => {
                    return <TagBadge key={item.id} tag={item} />
                })}
            </div>
        </div>
    );
}