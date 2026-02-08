import { useEffect, useRef } from "react";

export default function MathRenderer({ content }) {
  const ref = useRef();

  // ⭐ convert display math → inline math
  const processedContent = content
    ?.replace(/\$\$(.*?)\$\$/gs, '$$$1$');

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise([ref.current]);
    }
  }, [processedContent]);

  return (
    <div
      ref={ref}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
