import 'github-markdown-css/github-markdown-light.css';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from "unified";

export const MarkdownPreview = ({doc}: {doc: string}) => {
    const processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true });

    const mdastTree = processor.parse(doc);
    const hastTree = processor.runSync(mdastTree, doc)

    const result = toJsxRuntime(hastTree, {
        Fragment,
        ignoreInvalidStyle: true,
        jsx,
        jsxs,
        passKeys: true,
        passNode: true
    });

    return (
        <div className="rounded border px-3 py-2 markdown-body !text-sm">
            {result}
        </div>
    );
}