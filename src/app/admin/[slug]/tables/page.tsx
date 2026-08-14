import { notFound } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import TableCreateForm from "@/components/admin/tables/TableCreateForm";
import SalonEditor from "@/components/admin/tables/SalonEditor";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { getRestaurantTables } from "@/lib/db/restaurants/tables/getRestaurantTables";
import { getTablesStatus } from "@/lib/tables/getTablesStatus";

export const dynamic = "force-dynamic";

type Props={params:Promise<{slug:string}>};
export default async function TablesPage({params}:Props){
 const {slug}=await params; const restaurant=await getRestaurant(slug); if(!restaurant)notFound();
 const [tables,statuses]=await Promise.all([getRestaurantTables(restaurant.id),getTablesStatus(restaurant.id)]);
 const statusByTable=new Map(statuses.map(s=>[s.number,s]));
 const salonTables=tables.map((table,index)=>{const s=statusByTable.get(String(table.number));return {id:table.id,number:table.number,name:table.name,status:(s?.status??"free") as "free"|"pending"|"preparing"|"ready"|"served"|"bill",items:s?.items??0,total:s?.total??0,position_x:(table as typeof table & {position_x?:number|null}).position_x??null,position_y:(table as typeof table & {position_y?:number|null}).position_y??null};});
 return <main className="space-y-8"><PageHeader title="Mesas" description={`Gestiona las mesas de ${restaurant.name}.`}/><TableCreateForm restaurantId={restaurant.id} slug={slug}/><SalonEditor slug={slug} restaurantId={restaurant.id} tables={salonTables}/></main>;
}
