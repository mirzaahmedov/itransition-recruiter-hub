import { MDXEditor as Editor, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, markdownShortcutPlugin, linkPlugin, linkDialogPlugin, imagePlugin, type MDXEditorMethods } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import type { FC } from "react";
import { useRef, useEffect } from "react";

export const MDXEditor: FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const ref = useRef<MDXEditorMethods>(null);

  useEffect(() => {
    if (ref.current && value !== ref.current.getMarkdown()) {
      ref.current.setMarkdown(value);
    }
  }, [value]);

  return (
    <div className="mdx-editor-wrapper border rounded-lg overflow-hidden [&_.mdxeditor]:border-0">
      <Editor
        ref={ref}
        markdown={value}
        onChange={onChange}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin(),
        ]}
        contentEditableClassName="min-h-[200px] px-3 py-2 text-sm outline-none"
      />
    </div>
  );
};
