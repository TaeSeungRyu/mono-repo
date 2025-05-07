import Link from "next/link";

//[use case] Presentation Layer
export default async function TestPage() {
  return (
    <div className="grid items-center justify-items-center">
      <div>test</div>
      <Link href="/board">back back </Link>
    </div>
  );
}
