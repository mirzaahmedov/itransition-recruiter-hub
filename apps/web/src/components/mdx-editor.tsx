import {
  BoldItalicUnderlineToggles,
  MDXEditor as Editor,
  listsPlugin,
  ListsToggle,
  toolbarPlugin,
  UndoRedo,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import type { FC } from "react";
import { useEffect, useMemo, useRef } from "react";

export const MDXEditor: FC<{
  readOnly?: boolean;
  hideToolbar?: boolean;
  value: string;
  onChange: (value: string) => void;
}> = ({ hideToolbar = false, readOnly = false, value, onChange }) => {
  const ref = useRef<MDXEditorMethods>(null);

  useEffect(() => {
    if (ref.current && value !== ref.current.getMarkdown()) {
      ref.current.setMarkdown(value);
    }
  }, [value]);

  const plugins = useMemo(() => {
    const pluginsList = [listsPlugin()];

    if (!hideToolbar) {
      pluginsList.push(
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <UndoRedo />
            </>
          ),
        }),
      );
    }
    return pluginsList;
  }, [hideToolbar]);

  return (
    <div className="mdx-editor-wrapper border rounded-lg overflow-hidden [&_.mdxeditor]:border-0 [&_.mdxeditor]:bg-background">
      <Editor
        readOnly={readOnly}
        ref={ref}
        markdown={value}
        onChange={onChange}
        plugins={plugins}
        contentEditableClassName="min-h-[200px] p-1 text-sm outline-none prose prose-strong:text-foreground dark:prose-invert"
      />
    </div>
  );
};
