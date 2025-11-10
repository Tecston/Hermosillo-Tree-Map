import React from "react";

type Props = { src: string; title?: string };

export default function VanillaEmbed({ src, title = "Vanilla" }: Props) {
  return (
    <iframe
      src={src}
      title={title}
      style={{ width: "100%", height: "100%", border: 0, display: "block" }}
    />
  );
}
