import React, { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";

// Configure Monaco loader
loader.config({ monaco });

interface CodeEditorProps {
  code: string;
  language?: string;
  readOnly?: boolean;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language = "javascript",
  readOnly = true,
  height = "300px",
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (monacoEl.current) {
      editorRef.current = monaco.editor.create(monacoEl.current, {
        value: code,
        language,
        readOnly,
        automaticLayout: true,
        theme: "vs-light",
        minimap: { enabled: false },
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        fontSize: 14,
        wordWrap: "on",
      });
    }

    return () => {
      editorRef.current?.dispose();
    };
  }, [code, language, readOnly]);

  return (
    <div
      className="border rounded-lg overflow-hidden"
      style={{ height }}
      ref={monacoEl}
    />
  );
};

export default CodeEditor;
