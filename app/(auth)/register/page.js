// app/(auth)/register/page.jsx
import { Suspense } from "react";
import RegisterPage from "./RegisterPage";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading...</p>
      </div>
    }>
      <RegisterPage />
    </Suspense>
  );
}