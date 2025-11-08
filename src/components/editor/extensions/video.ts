/**
 * @see https://github.com/sereneinserenade/tiptap-extension-video
 */

import { type VideoHTMLAttributes } from "react";
import { Node, nodeInputRule } from "@tiptap/react";
import { Plugin, PluginKey } from "prosemirror-state";

type VideoOptions = {
  HTMLAttributes: Partial<VideoHTMLAttributes<HTMLVideoElement>>;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      /**
       * Set a video node
       */
      setVideo: (src: string) => ReturnType;
      /**
       * Toggle a video
       */
      toggleVideo: (src: string) => ReturnType;
    };
  }
}

const VIDEO_INPUT_REGEX = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

const Video = Node.create({
  name: "video",
  group: "block",

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el) => (el as HTMLSpanElement).getAttribute("src"),
        renderHTML: (attrs) => ({ src: attrs["src"] }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "video",
        getAttrs: (element) => ({
          src: (element as HTMLVideoElement).getAttribute("src"),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      { controls: "true", style: "width: 100%", ...HTMLAttributes },
      ["source", HTMLAttributes],
    ];
  },

  addCommands() {
    return {
      setVideo: (src: string) => {
        return ({ commands }) => {
          return commands.insertContent(
            `<video controls="true" style="width: 100%" src="${src}" />`,
          );
        };
      },
      toggleVideo: () => {
        return ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph");
        };
      },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        type: this.type,
        find: VIDEO_INPUT_REGEX,
        getAttributes: (match) => {
          return { src: match[2] };
        },
      }),
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("videoDropPlugin"),

        props: {
          handleDOMEvents: {
            drop(view, event) {
              const files = event.dataTransfer?.files || [];

              if (files.length === 0) {
                return false;
              }

              const videos = Array.from(files).filter((file) => /video/i.test(file.type));

              if (videos.length === 0) {
                return false;
              }

              event.preventDefault();

              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });

              for (const video of videos) {
                const reader = new FileReader();

                reader.onload = (readerEvent) => {
                  const node = view.state.schema.nodes["video"].create({
                    src: readerEvent.target?.result,
                  });

                  if (coordinates && typeof coordinates.pos === "number") {
                    const transaction = view.state.tr.insert(coordinates?.pos, node);

                    view.dispatch(transaction);
                  }
                };

                reader.readAsDataURL(video);
              }

              return true;
            },
          },
        },
      }),
    ];
  },
});

export { Video };
export type { VideoOptions };
