import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-start pt-20">
      <div className="w-full max-w-md p-8 border rounded-lg shadow-xl bg-white">
        <LoginForm />
      </div>
    </div>
  );
}
