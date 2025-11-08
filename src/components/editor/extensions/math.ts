import { mathPlugin, REGEX_INLINE_MATH_DOLLARS } from "@benrbray/prosemirror-math";
import { Editor, InputRule, mergeAttributes, Node } from "@tiptap/core";
import { Node as ProseMirrorNode, Schema } from "prosemirror-model";
import { NodeSelection, TextSelection, Transaction } from "prosemirror-state";

const MathInline = Node.create({
  name: "math_inline",
  group: "inline math",
  content: "text*",
  atom: true,
  inline: true,

  parseHTML() {
    return [{ tag: "math-inline" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["math-inline", mergeAttributes({ class: "math-node" }, HTMLAttributes), 0];
  },

  addProseMirrorPlugins() {
    return [mathPlugin];
  },

  addInputRules() {
    return [
      new InputRule({
        find: REGEX_INLINE_MATH_DOLLARS,
        handler: ({ state, range, match }) => {
          const start = range.from;
          const end = range.to;
          const $start = state.doc.resolve(start);
          const $end = state.doc.resolve(end);

          if (!$start.parent.canReplaceWith($start.index(), $end.index(), this.type)) {
            return null;
          }

          if ($start.parent.type.name === this.name) {
            return null;
          }

          state.tr.replaceRangeWith(
            start,
            end,
            this.type.create({}, this.type.schema.text(match[1])),
          );
        },
      }),
    ];
  },
});

type OriginStyles = {
  color: string;
  fontSize: string;
  fontFamily: string;
};

const wrapMathFormula = (
  transaction: Transaction,
  schema: Schema,
  from: number,
  to: number,
): Transaction => {
  const mathNodeType = schema.nodes["math_inline"];

  const selectedText = transaction.doc.textBetween(from, to);

  if (!selectedText) {
    return transaction;
  }

  const mathNode = mathNodeType.create({}, schema.text(selectedText));

  transaction = transaction.deleteRange(from, to);
  const insertPos = transaction.mapping.map(from);
  transaction = transaction.insert(insertPos, mathNode);

  return transaction;
};

const unwrapMathFormula = (
  transaction: Transaction,
  schema: Schema,
  styles: OriginStyles,
  node: ProseMirrorNode,
  pos: number,
): Transaction => {
  if (!node || node.type.name !== "math_inline") {
    return transaction;
  }

  const nodeSize = node.nodeSize;
  const mathContent = node.textContent;

  const textStyleMark = schema.marks["textStyle"]?.create({
    color: styles.color,
    fontSize: styles.fontSize,
    fontFamily: styles.fontFamily,
  });
  const markedText = schema.text(mathContent, textStyleMark ? [textStyleMark] : []);

  transaction = transaction.replaceWith(pos, pos + nodeSize, markedText);

  return transaction;
};

const toggleMathFormula = (editor: Editor, styles: OriginStyles) => {
  const { state, view } = editor;
  const { selection, schema } = state;
  const { from, to, $from, empty } = selection;
  const mathNodeType = schema.nodes["math_inline"];

  let transaction = state.tr;
  let nodeToUnwrap: { node: ProseMirrorNode; pos: number } | null = null;
  let finalSelectionPos: number | null = null;
  let setSelection = false;

  if (selection instanceof NodeSelection && selection.node.type === mathNodeType) {
    nodeToUnwrap = { node: selection.node, pos: $from.pos };
  } else if (empty) {
    if ($from.nodeBefore?.type === mathNodeType) {
      nodeToUnwrap = {
        node: $from.nodeBefore,
        pos: $from.pos - $from.nodeBefore.nodeSize,
      };
    } else if ($from.nodeAfter?.type === mathNodeType) {
      if ($from.pos === from && state.doc.resolve(from).nodeAfter === $from.nodeAfter) {
        nodeToUnwrap = { node: $from.nodeAfter, pos: $from.pos };
      }
    } else if ($from.parent.type === mathNodeType) {
      const parentPos = $from.before($from.depth);
      nodeToUnwrap = { node: $from.parent, pos: parentPos };
    }
  } else {
    let foundPos = -1;
    let foundNode: ProseMirrorNode | null = null;
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type === mathNodeType && pos >= from && pos + node.nodeSize <= to) {
        if (!foundNode) {
          foundNode = node;
          foundPos = pos;
        }
      }
      return true;
    });
    if (foundNode && foundPos !== -1) {
      nodeToUnwrap = { node: foundNode, pos: foundPos };
    }
  }

  if (nodeToUnwrap) {
    const mathContentLength = nodeToUnwrap.node.textContent.length;
    transaction = unwrapMathFormula(
      transaction,
      schema,
      styles,
      nodeToUnwrap.node,
      nodeToUnwrap.pos,
    );
    if (transaction.docChanged) {
      finalSelectionPos = transaction.mapping.map(nodeToUnwrap.pos) + mathContentLength;
      setSelection = true;
    }
  } else if (!empty) {
    transaction = wrapMathFormula(transaction, schema, from, to);
    if (transaction.docChanged) {
      const mappedFrom = transaction.mapping.map(from);
      const newNode = transaction.doc.nodeAt(mappedFrom);
      if (newNode) {
        finalSelectionPos = mappedFrom + newNode.nodeSize;
        setSelection = true;
      }
    }
  } else {
    const newNode = mathNodeType.create({}, schema.text(" "));
    transaction = transaction.replaceSelectionWith(newNode);
    if (transaction.docChanged) {
      const insertPos = transaction.mapping.map(from);
      finalSelectionPos = insertPos + 1;
      setSelection = true;
    }
  }

  if (transaction.docChanged) {
    if (setSelection && finalSelectionPos !== null) {
      const safePos = Math.min(finalSelectionPos, transaction.doc.content.size);
      transaction = transaction.setSelection(TextSelection.create(transaction.doc, safePos));
    }
    view.dispatch(transaction);
    view.focus();
  }
};

export const clearMathFormula = (editor: Editor, styles: OriginStyles) => {
  const { state, view } = editor;
  const { selection } = state;
  const { from, to, empty } = selection;
  const { schema } = state;
  const mathNodeType = schema.nodes["math_inline"];

  if (empty || !mathNodeType) {
    return;
  }

  const nodesToUnwrap: { node: ProseMirrorNode; pos: number }[] = [];

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type === mathNodeType) {
      const nodeStart = pos;
      const nodeEnd = pos + node.nodeSize;
      if (nodeStart >= from && nodeEnd <= to) {
        nodesToUnwrap.push({ node, pos });
      }
    }
  });

  if (nodesToUnwrap.length === 0) {
    return;
  }

  nodesToUnwrap.sort((a, b) => b.pos - a.pos);

  let transaction = state.tr;
  let replacementOccurred = false;

  nodesToUnwrap.forEach(({ node, pos }) => {
    const nodeSize = node.nodeSize;
    const mathContent = node.textContent;
    const textStyleMark = schema.marks["textStyle"]?.create({
      color: styles.color,
      fontSize: styles.fontSize,
      fontFamily: styles.fontFamily,
    });
    const markedText = schema.text(mathContent, textStyleMark ? [textStyleMark] : []);
    transaction = transaction.replaceWith(pos, pos + nodeSize, markedText);
    replacementOccurred = true;
  });

  if (replacementOccurred) {
    const finalSelectionEndPos = transaction.mapping.map(to);
    transaction = transaction.setSelection(
      TextSelection.create(transaction.doc, transaction.mapping.map(from), finalSelectionEndPos),
    );
    view.dispatch(transaction);
    view.focus();
  }
};

export { MathInline, wrapMathFormula, unwrapMathFormula, toggleMathFormula };
