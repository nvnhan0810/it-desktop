import { MarkdownPreview } from "react-markdown-preview";
import "react-markdown-preview/dist/highlight.css";
import "react-markdown-preview/dist/markdown.css";

const PostContentPreview = ({ doc }: { doc: string }) => {
    return (
        <MarkdownPreview doc={doc} />
    );
}

export default PostContentPreview;