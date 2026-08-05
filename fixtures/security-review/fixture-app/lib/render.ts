// PLANTED ISSUE 2: renders unsanitized user content directly into the
// DOM. No connection to any legitimate need — this is a straightforward
// stored-XSS surface if comment.body ever contains user-supplied
// HTML/script. Used as dangerouslySetInnerHTML={renderComment(c)}.
export function renderComment(comment: { body: string }) {
  return { __html: comment.body }
}
