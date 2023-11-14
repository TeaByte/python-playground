import Editor from "@monaco-editor/react";

export default function CodeEditor(probs) {
  return (
    <Editor
      className="rounded-sm"
      language="python"
      defaultLanguage="python"
      theme={"vs-dark"}
      loading={"Editor is loading..."}
      value={probs.pythonCode}
      onChange={(e) => {
        if (e) probs.setPythonCode(e);
      }}
    />
  );
}
