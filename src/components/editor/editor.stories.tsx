import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";

import { Editor } from "./editor";

const meta = {
  title: "Components/Editor",
  component: Editor,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["simple", "full"],
    },
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Editor>;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    variant: "simple",
    onContentChange: (content) => {
      console.log(content.getHTML());
      console.log(content.getJSON());
      console.log(content.getText());
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const element = canvas.getByTestId("Editor");
    await expect(element).toBeInTheDocument();
  },
};

export const Full: Story = {
  args: {
    variant: "full",
    onContentChange: (content) => {
      console.log(content.getHTML());
      console.log(content.getJSON());
      console.log(content.getText());
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const element = canvas.getByTestId("Editor");
    await expect(element).toBeInTheDocument();
  },
};

export const FullDisabled: Story = {
  args: {
    variant: "full",
    disabled: true,
    onContentChange: (content) => {
      console.log(content.getHTML());
      console.log(content.getJSON());
      console.log(content.getText());
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const element = canvas.getByTestId("Editor");
    await expect(element).toBeInTheDocument();
  },
};

export const FullWithError: Story = {
  args: {
    variant: "full",
    showError: true,
    onContentChange: (content) => {
      console.log(content.getHTML());
      console.log(content.getJSON());
      console.log(content.getText());
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const element = canvas.getByTestId("Editor");
    await expect(element).toBeInTheDocument();
  },
};

export default meta;
