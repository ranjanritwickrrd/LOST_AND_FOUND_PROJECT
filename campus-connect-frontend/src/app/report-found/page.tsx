import { AuthGuard } from "@/lib/guards";
import { ItemCreateForm } from "@/components/forms/ItemCreateForm";

export default function ReportFoundPage() {
  return (
    <AuthGuard>
      <ItemCreateForm type="FOUND" />
    </AuthGuard>
  );
}
