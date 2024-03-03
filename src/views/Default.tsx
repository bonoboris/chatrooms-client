import { Link } from "wouter";

export default function Default() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center space-y-4 p-8">
      <p className="text-4xl">You are lost...</p>
      <p className="text-2xl">
        Go back to{" "}
        <Link href="/" className="font-semibold">
          homepage
        </Link>
      </p>
    </main>
  );
}
