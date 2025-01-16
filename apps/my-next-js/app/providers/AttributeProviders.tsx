import AuthContext from "@/app/context/AuthContext";
import QueryProviders from "./QueryProvider";

export default async function AttributeProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContext>
      <QueryProviders>{children}</QueryProviders>
    </AuthContext>
  );
}
