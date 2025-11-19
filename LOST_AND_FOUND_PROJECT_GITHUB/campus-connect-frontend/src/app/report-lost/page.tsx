import { AuthGuard } from "@/lib/guards";
import { ItemCreateForm } from "@/components/forms/ItemCreateForm";

export default function ReportLostPage() {
  return (
    <AuthGuard>
      <ItemCreateForm type="LOST" />
    </AuthGuard>
  );
}
