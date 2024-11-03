import { jsx } from "react/jsx-runtime";
import { Node, mergeAttributes, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useRef, useEffect } from "react";
import { Superscript } from "@tiptap/extension-superscript";
import { Subscript } from "@tiptap/extension-subscript";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { TextAlign } from "@tiptap/extension-text-align";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { B as BackgroundColor, I as Indent } from "./admin-routes-965bd348.mjs";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import php from "highlight.js/lib/languages/php";
import shell from "highlight.js/lib/languages/shell";
import bash from "highlight.js/lib/languages/bash";
import ruby from "highlight.js/lib/languages/ruby";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import c from "highlight.js/lib/languages/c";
/* empty css                                        */import { bx as useCallbackRef } from "../server-entry.mjs";
import { Extension } from "@tiptap/core";
import "react-router-dom";
import "clsx";
import "./use-channel-c8660ecc.mjs";
import "framer-motion";
import "@react-stately/utils";
import "./play-arrow-filled-d45cea03.mjs";
import "react-hook-form";
import "@react-aria/utils";
import "@react-aria/focus";
import "@react-aria/interactions";
import "@react-stately/color";
import "react-dom";
import "@tanstack/react-query";
import "dot-object";
import "./backstage-track-insights-106425a1.mjs";
import "@internationalized/date";
import "./Edit-7b19e063.mjs";
import "@internationalized/number";
import "nano-memoize";
import "zustand";
import "zustand/middleware";
import "zustand/middleware/immer";
import "deepmerge";
import "immer";
import "react-colorful";
import "nanoid";
import "deep-object-diff";
import "./use-resume-subscription-cddb206a.mjs";
import "./MoreHoriz-2a3c8f85.mjs";
import "@tanstack/react-virtual";
import "prosemirror-state";
import "react-dom/server";
import "process";
import "http";
import "axios";
import "react-router-dom/server.mjs";
import "slugify";
import "@floating-ui/react-dom";
import "react-merge-refs";
import "@react-aria/ssr";
import "axios-retry";
import "tus-js-client";
import "react-use-cookie";
import "mime-match";
import "react-use-clipboard";
const Embed = Node.create({
  name: "embed",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      src: {
        default: null
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "iframe"
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "iframe",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
    ];
  },
  addCommands() {
    return {
      setEmbed: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options
        });
      }
    };
  }
});
const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("php", php);
lowlight.register("shell", shell);
lowlight.register("bash", bash);
lowlight.register("ruby", ruby);
lowlight.register("python", python);
lowlight.register("java", java);
lowlight.register("c", c);
const InfoBlock = Node.create({
  name: "be-info-block",
  group: "block",
  content: "inline*",
  defining: true,
  addAttributes() {
    return {
      type: {
        default: "success",
        renderHTML: (attrs) => {
          return { class: attrs.type };
        }
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "div",
        getAttrs: (node) => node.classList.contains("info-block") && null
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "info-block"
      }),
      ["div", { class: "title" }, "Important:"],
      ["p", 0]
    ];
  },
  addCommands() {
    return {
      addInfo: (attributes) => ({ commands }) => {
        return commands.setNode(this.name, attributes);
      }
    };
  }
});
function ArticleBodyEditor({
  initialContent = "",
  children,
  onLoad: _onLoad,
  onCtrlEnter,
  minHeight = "min-h-320",
  autoFocus
}) {
  const onLoad = useCallbackRef(_onLoad);
  const calledOnLoad = useRef(false);
  const extensions = [
    StarterKit.configure({
      codeBlock: false
    }),
    Underline,
    Link.extend({
      inclusive: false,
      validate: {
        // only linkify links that start with a protocol
        url: (value) => /^https?:\/\//.test(value)
      }
    }),
    Image,
    Superscript,
    Subscript,
    TextStyle,
    Color,
    BackgroundColor,
    Indent,
    CodeBlockLowlight.configure({
      lowlight
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"]
    }),
    InfoBlock,
    Embed
  ];
  if (onCtrlEnter) {
    extensions.push(
      Extension.create({
        addKeyboardShortcuts: () => ({
          "Cmd-Enter"() {
            onCtrlEnter();
            return true;
          },
          "Ctrl-Enter"() {
            onCtrlEnter();
            return true;
          }
        })
      })
    );
  }
  const editor = useEditor({
    extensions,
    onFocus: () => {
    },
    autofocus: autoFocus,
    content: initialContent
  });
  useEffect(() => {
    if (editor) {
      return () => editor.destroy();
    }
  }, [editor]);
  if (!editor) {
    return null;
  }
  if (editor && onLoad && !calledOnLoad.current) {
    onLoad(editor);
    calledOnLoad.current = true;
  }
  return children(
    /* @__PURE__ */ jsx(EditorContent, { className: minHeight, editor }),
    editor
  );
}
export {
  ArticleBodyEditor as default
};
//# sourceMappingURL=article-body-editor-c5519da2.mjs.map
