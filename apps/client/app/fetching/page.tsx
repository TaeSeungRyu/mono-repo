import { Suspense } from "react";
import Loading from "../components/Loading";

//프리 패칭 예시(Promise 부분이 실제로는 fetch로 대체)
//그런데 프리 패칭할 데이터가 느린 경우 Suspense와 fallback을 사용하여 스켈레톤 UI를 보여 준다!
async function LazyFetchingContent() {
  const fetchedDataFromApiServer: string = await new Promise((resolve) => {
    setTimeout(() => resolve("data from server!!!"), 2000);
  }); // Wait for the data
  return <div>{fetchedDataFromApiServer}</div>;
}

export default function Fetching() {
  return (
    <div className="grid items-center justify-items-center">
      <div>패칭 페이지 예시</div>
      <Suspense fallback={<Loading />}>
        <LazyFetchingContent />
      </Suspense>
    </div>
  );
}
