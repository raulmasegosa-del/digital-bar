type Props = {
  orders:any[];
};


export default function KitchenBoard({
  orders
}:Props){


return (

<div className="grid gap-6 md:grid-cols-2">


{
orders.map(order=>(


<div
key={order.id}
className="
rounded-2xl
bg-white
p-6
shadow
"
>


<div className="flex justify-between">

<h2 className="text-2xl font-bold">

Mesa {order.table_number || "-"}

</h2>


<span className="
rounded-full
bg-orange-100
px-3
py-1
text-sm
">

{order.status}

</span>


</div>



<hr className="my-4"/>



{
order.order_items.map((item:any)=>(

<div
key={item.id}
className="mb-3"
>


<p className="font-semibold">

{item.quantity} × {item.name}

</p>


{
item.options?.length>0 && (

<ul className="ml-4 text-sm text-gray-500">

{
item.options.map((o:any)=>(

<li key={o.optionId}>
+ {o.optionName}
</li>

))
}

</ul>

)

}



</div>

))
}



<div className="mt-4 font-bold">

Total:
{Number(order.total).toFixed(2)} €

</div>


</div>


))
}


</div>

);


}