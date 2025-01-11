import { cn } from "@/lib/utils";
import { Tag } from "@/types/tag.type";
import { Link } from "react-router-dom";

const TagBadge = ({ tag, classes = '', useLink = true }: { tag: Tag, classes?: string, useLink?: boolean,}) => {
    return useLink ? (
        <Link to={`/tags/${tag.slug}`}>
            <span className={cn(
                "inline-block border rounded-full px-3 py-1 text-sm hover:bg-gray-300",
                classes
            )}>
                {tag.name}
            </span>
        </Link>
    ) : (
        <span className={cn(
            "inline-block border rounded-full px-3 py-1 text-sm",
            classes
        )}>
            {tag.name}
        </span>
    );
};

export default TagBadge;