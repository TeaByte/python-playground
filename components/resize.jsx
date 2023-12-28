"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import Editor from "@monaco-editor/react";

export function Resizable({
  codeString,
  codeResult,
  direction,
  setCodeString,
  editorTheme,
  isError,
}) {
  console.log(isError);
  return (
    <ResizablePanelGroup direction={direction} className="rounded-lg border">
      <ResizablePanel defaultSize={75}>
        <div
          className={
            "flex h-full items-center justify-center py-4 " +
            (editorTheme === "vs-dark" ? "bg-[#1E1E1E]" : "bg-white")
          }
        >
          <Editor
            theme={editorTheme}
            language="python"
            defaultLanguage="python"
            value={codeString}
            onChange={(e) => {
              if (e) setCodeString(e);
            }}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25}>
        <pre className="bg-black h-full w-full text-white overflow-x-auto p-4">
          <code
            className={
              "w-full font-mono text-sm " +
              (isError ? "text-red-500" : "text-white")
            }
          >
            {codeResult}
          </code>
        </pre>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
