import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/app/utils/authOptions";

export default async function SecurePage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center">
      <div>secure page!</div>
      session: {session && JSON.stringify(session)}
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
