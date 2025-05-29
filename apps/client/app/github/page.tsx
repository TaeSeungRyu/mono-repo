import GitComponent from "../components/GitComponent";

//[use case] Presentation Layer
export default async function GithubPage() {
  return (
    <div className="grid items-center justify-items-center">
      <GitComponent></GitComponent>
    </div>
  );
}
