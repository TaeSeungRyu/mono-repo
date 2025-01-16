export default async function Page({
  params,
}: {
  params: Promise<{ someData: string }>;
}) {
  const someData = (await params).someData;
  return (
    <div>get 파라미터로 온 값 : {decodeURI(decodeURIComponent(someData))}</div>
  );
}
