import AuthContext from "@/app/context/AuthContext";
import QueryProviders from "./QueryProvider";
import ModeThemProvider from "./ModeThemProvider";
import MobileDetectorProviders from "./MobileDetectorProviders";

export default async function AttributeProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileDetectorProviders>
      <AuthContext>
        <QueryProviders>
          <ModeThemProvider>{children}</ModeThemProvider>
        </QueryProviders>
      </AuthContext>
    </MobileDetectorProviders>
  );
}
