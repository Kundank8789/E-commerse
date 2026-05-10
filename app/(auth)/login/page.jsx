// app/(auth)/login/page.jsx
import { Suspense } from "react";
import LoginPage from "./LoginPage";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading...</p>
      </div>
    }>
      <LoginPage />
    </Suspense>
  );
}