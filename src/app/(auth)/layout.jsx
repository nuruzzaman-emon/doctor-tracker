import AuthHeader from "@/components/(auth)/AuthHeader";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-dvh w-full min-w-0 flex-col">
      <AuthHeader />

      <main className="flex w-full min-w-0 flex-1 items-start justify-center px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
