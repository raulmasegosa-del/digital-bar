import PageHeader from "@/components/ui/PageHeader";
import RestaurantForm from "@/components/super/RestaurantForm";

export default function NewRestaurantPage() {
  return (
    <>
      <PageHeader
        title="Nuevo restaurante"
        description="Crea un nuevo restaurante en Digital Bar."
      />

      <div className="mx-auto max-w-3xl">
        <RestaurantForm />
      </div>
    </>
  );
}