import { Extension } from "@tiptap/core";

type IndentOptions = {
  types: string[];
  minLevel: number;
  maxLevel: number;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

const Indent = Extension.create<IndentOptions>({
  name: "indent",

  addOptions() {
    return {
      types: ["paragraph", "heading"],
      minLevel: 0,
      maxLevel: 8,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            renderHTML: (attributes) => {
              const indent = typeof attributes["indent"] === "number" ? attributes["indent"] : 0;
              return { "data-indent": indent };
            },
            parseHTML: (element) => {
              const val = element.getAttribute("data-indent");
              return val ? Number(val) : 0;
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ commands, state }) => {
          const { $from } = state.selection;
          const node = $from.node();
          const currentIndent = typeof node.attrs["indent"] === "number" ? node.attrs["indent"] : 0;
          const indent = Math.min(currentIndent + 1, this.options.maxLevel);
          return commands.updateAttributes(node.type.name, { indent });
        },
      outdent:
        () =>
        ({ commands, state }) => {
          const { $from } = state.selection;
          const node = $from.node();
          const currentIndent = typeof node.attrs["indent"] === "number" ? node.attrs["indent"] : 0;
          const indent = Math.max(currentIndent - 1, this.options.minLevel);
          return commands.updateAttributes(node.type.name, { indent });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.indent(),
      "Shift-Tab": () => this.editor.commands.outdent(),
    };
  },
});

export { Indent };
