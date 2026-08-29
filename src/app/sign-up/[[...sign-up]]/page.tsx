import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { isClerkConfigured } from "@/lib/config";

export default function SignUpPage() {
  if (!isClerkConfigured()) redirect("/");
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07131f]">
      <SignUp />
    </div>
  );
}
