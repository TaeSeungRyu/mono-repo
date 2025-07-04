"use client"; // Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("글로벌 오류 발생", error);
  // alert(1);
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>글로벌 오류 페이지</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
