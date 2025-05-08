import BoardComponent from "../components/BoardComponent";
import BoardCRUDComponent from "../components/BoardCRUDComponent";
import LoginContextProvider from "../components/LoginContextProvider";

//[use case] Presentation Layer
export default async function BoardPage() {
  return (
    <div className="grid items-center justify-items-center">
      <LoginContextProvider>
        <BoardComponent></BoardComponent>
        <BoardCRUDComponent></BoardCRUDComponent>
      </LoginContextProvider>
    </div>
  );
}
