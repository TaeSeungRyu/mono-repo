import Link from "next/link";
import ZustandText from "../components/ZustandText";
import Test from "../components/Test";

export default function Board() {
  return (
    <div className="grid items-center justify-items-center">
      <div>im borad</div>
      <Test></Test>
      <div>
        <ZustandText></ZustandText>
      </div>
      <div>
        <Link
          href={{
            pathname: "/",
            query: { page: "1" },
          }}
        >
          go first page
        </Link>
      </div>
    </div>
  );
}
