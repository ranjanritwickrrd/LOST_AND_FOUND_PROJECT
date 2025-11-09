import { RegisterForm } from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-start pt-20">
      <div className="w-full max-w-md p-8 border rounded-lg shadow-xl bg-white">
        <RegisterForm />
      </div>
    </div>
  );
}
