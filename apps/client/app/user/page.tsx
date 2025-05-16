import UserManageComponent from "../components/UserManageComponent";

//[use case] Presentation Layer
export default async function UserListPage() {
  return (
    <div className="grid items-center justify-items-center">
      <UserManageComponent></UserManageComponent>
    </div>
  );
}
