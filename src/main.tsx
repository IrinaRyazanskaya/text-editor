import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { type EditorContent, Editor } from "./components/editor";

import "./index.css";

const handleChange = (content: EditorContent) => {
  console.log(content.getHTML());
  console.log(content.getJSON());
  console.log(content.getText());
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Editor variant="full" onContentChange={handleChange} />
  </StrictMode>,
);
