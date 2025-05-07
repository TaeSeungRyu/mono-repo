import { Sign } from "crypto";
import SigninPageComponent from "./components/SigninPageComponent";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">😁</h2>
        <SigninPageComponent />
      </div>
    </div>
  );
}
