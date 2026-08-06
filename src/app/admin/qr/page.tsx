import PageHeader from "@/components/ui/PageHeader";
import QRGrid from "@/components/admin/qr/QRGrid";

export default function QRPage() {
  return (
    <main className="space-y-8">
      <PageHeader
        title="📱 Códigos QR"
        description="Genera, imprime y descarga los códigos QR para las mesas del restaurante."
      />

      <QRGrid />
    </main>
  );
}