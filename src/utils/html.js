export function htmlDetailToText(htmlContent) {
  let text = htmlContent.replace(/(<([^>]+)>)/gi, "");
  text = text.replace(/(&amp;|&lt;|&gt;|&quot;|&#39;|&nbsp;)/g, (s) => {
    const entityMap = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
      "&nbsp;": " ",
    };
    return entityMap[s];
  });
  return text;
}
