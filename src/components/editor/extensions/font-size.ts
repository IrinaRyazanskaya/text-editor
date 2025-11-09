import { Extension, type CommandProps } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

const FontSize = Extension.create({
  name: "fontSize",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,

            parseHTML: (element) => {
              if (!(element instanceof HTMLElement)) {
                return "";
              }

              return element.style.fontSize.replace(/['"]+/g, "");
            },

            renderHTML: (attributes) => {
              if (!attributes["fontSize"]) {
                return {};
              }

              return {
                style: `font-size: ${attributes["fontSize"]}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: CommandProps) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },

      unsetFontSize:
        () =>
        ({ chain }: CommandProps) => {
          return chain().setMark("textStyle", { fontSize: null }).run();
        },
    };
  },
});

function getStyleFontSize(style: string): string {
  let fontSize = "16px";

  switch (style) {
    case "h1": {
      fontSize = "32px";
      break;
    }
    case "h2": {
      fontSize = "24px";
      break;
    }
    case "h3": {
      fontSize = "18px";
      break;
    }
  }

  return fontSize;
}

export { FontSize, getStyleFontSize };
