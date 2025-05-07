import BoardComponent from "../components/BoardComponent";
import BoardCRUDComponent from "../components/BoardCRUDComponent";
import LoginContextProvider from "../components/LoginContextProvider";

//[use case] Presentation Layer
export default async function BoardPage() {
  return (
    <div className="grid items-center justify-items-center">
      <div>board(수정하는 경우 20% 확률로 일부러 틀림!)</div>
      <LoginContextProvider>
        <BoardComponent></BoardComponent>
        <BoardCRUDComponent></BoardCRUDComponent>
      </LoginContextProvider>
    </div>
  );
}
