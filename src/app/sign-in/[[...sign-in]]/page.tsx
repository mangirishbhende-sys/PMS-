import { SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { isClerkConfigured } from "@/lib/config";

export default function SignInPage() {
  if (!isClerkConfigured()) redirect("/");
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07131f]">
      <SignIn />
    </div>
  );
}
