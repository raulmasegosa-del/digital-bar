import { supabase } from "@/lib/supabase";


export async function createOrder({

  table,

  items,

  notes,

  total,

}: {

  table: string;

  items: any[];

  notes: string;

  total: number;

}) {


  // Crear pedido principal

  const { data: order, error } = await supabase
    .from("orders")
    .insert({

      table_number: table,

      notes,

      total,

      status: "pending",

    })
    .select()
    .single();



  if (error) {

    throw error;

  }



  // Crear líneas del pedido

  const rows = items.map(item => ({

    order_id: order.id,

    product_id: item.productId,

    name: item.name,

    quantity: item.quantity,

    price: item.price,

    options: item.options,

  }));



  const { error: itemError } = await supabase
    .from("order_items")
    .insert(rows);



  if (itemError) {

    throw itemError;

  }



  return order;

}