"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Grip, Save, X } from "lucide-react";
import { saveTableLayout } from "@/app/admin/[slug]/tables/actions";

type SalonTable={id:string;number:number;name:string|null;status:"free"|"pending"|"preparing"|"ready"|"served"|"bill";items:number;total:number;position_x:number|null;position_y:number|null};
type Props={slug:string;restaurantId:string;tables:SalonTable[]};
const styles={free:"border-zinc-600 bg-zinc-800",pending:"border-amber-400 bg-amber-400/15",preparing:"border-blue-400 bg-blue-400/15",ready:"border-green-400 bg-green-400/15",served:"border-emerald-400 bg-emerald-400/15",bill:"border-red-400 bg-red-400/15"};
const labels={free:"Libre",pending:"Recibido",preparing:"Preparando",ready:"Listo",served:"Servido",bill:"Cuenta"};
const BAR_KEY_PREFIX="digital-bar-salon-bar";
type Position={x:number;y:number};

export default function SalonEditor({slug,restaurantId,tables}:Props){
 const [editing,setEditing]=useState(false); const [dragging,setDragging]=useState<string|null>(null); const [draggingBar,setDraggingBar]=useState(false); const [saving,startSaving]=useTransition();
 const [positions,setPositions]=useState(()=>Object.fromEntries(tables.map((t,i)=>[t.id,{x:t.position_x??8+(i%5)*18,y:t.position_y??12+Math.floor(i/5)*24}])));
 const [barPosition,setBarPosition]=useState<Position>({x:50,y:86});
 useEffect(()=>{try{const saved=localStorage.getItem(`${BAR_KEY_PREFIX}:${restaurantId}`);if(saved)setBarPosition(JSON.parse(saved) as Position);}catch{ /* ignore invalid local layout */ }},[restaurantId]);
 function move(e:React.PointerEvent){if(!editing)return;const r=e.currentTarget.getBoundingClientRect();const x=Math.max(6,Math.min(94,(e.clientX-r.left)/r.width*100));const y=Math.max(8,Math.min(92,(e.clientY-r.top)/r.height*100));if(dragging){setPositions(p=>({...p,[dragging]:{x,y}}));}else if(draggingBar){setBarPosition({x,y});}}
 function save(){const payload=Object.entries(positions).map(([tableId,p])=>({tableId,x:Number(p.x.toFixed(3)),y:Number(p.y.toFixed(3))}));startSaving(async()=>{await saveTableLayout(restaurantId,slug,payload);localStorage.setItem(`${BAR_KEY_PREFIX}:${restaurantId}`,JSON.stringify({x:Number(barPosition.x.toFixed(3)),y:Number(barPosition.y.toFixed(3))}));setEditing(false);setDragging(null);setDraggingBar(false);});}
 function cancelEdit(){setEditing(false);setDragging(null);setDraggingBar(false);}
 return <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#181716]"><div className="flex flex-col gap-3 border-b border-zinc-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-semibold text-white">Salón</h2><p className="text-sm text-zinc-500">{editing?"Coloca las mesas y la barra como en tu local.":"Vista del salón, barra y estado de cada mesa."}</p></div>{editing?<div className="flex gap-2"><button type="button" onClick={cancelEdit} className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300"><X size={16}/>Cancelar</button><button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-950"><Save size={16}/>{saving?"Guardando...":"Guardar distribución"}</button></div>:<button type="button" onClick={()=>setEditing(true)} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-950"><Grip size={17}/>Editar Salón</button>}</div>
 <div className="relative min-h-[620px] touch-none overflow-hidden bg-[radial-gradient(circle_at_1px_1px,#3f3f46_1px,transparent_1px)] [background-size:24px_24px]" onPointerMove={move} onPointerUp={()=>{setDragging(null);setDraggingBar(false)}} onPointerCancel={()=>{setDragging(null);setDraggingBar(false)}}>
   <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{left:`${barPosition.x}%`,top:`${barPosition.y}%`}} onPointerDown={e=>{if(editing){e.preventDefault();setDraggingBar(true)}}}>
     <div className={`flex h-20 w-[50vw] min-w-[280px] max-w-[720px] items-center justify-center rounded-2xl border-2 border-amber-700/60 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 shadow-2xl shadow-black/30 transition-transform duration-200 ${editing?"rotate-90 cursor-grab border-amber-400/70":""}`}>
       <div className="flex items-center gap-3"><span className="text-2xl">🍸</span><span className="text-xl font-black uppercase tracking-[0.22em] text-amber-100">Barra</span>{editing&&<Grip size={18} className="text-amber-300"/>}</div>
     </div>
   </div>
   {tables.map(t=>{const p=positions[t.id];return <div key={t.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{left:`${p.x}%`,top:`${p.y}%`}} onPointerDown={e=>{if(editing){e.preventDefault();setDragging(t.id)}}}>{editing?<div className={`flex h-28 w-32 cursor-grab select-none flex-col items-center justify-center rounded-2xl border-2 shadow-xl ${styles[t.status]}`}><Grip size={16} className="mb-1 text-zinc-500"/><div className="flex h-12 w-20 items-center justify-center rounded-xl border-4 border-zinc-500 bg-zinc-700 text-xl font-black text-white">{t.number}</div><span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-300">{labels[t.status]}</span></div>:<Link href={`/admin/${slug}/tables/${t.id}`} className={`flex h-28 w-32 flex-col items-center justify-center rounded-2xl border-2 shadow-lg transition hover:scale-105 ${styles[t.status]}`}><div className="relative flex h-14 w-24 items-center justify-center"><div className="absolute h-10 w-20 rounded-xl border-4 border-zinc-500 bg-zinc-700"/><span className="z-10 text-xl font-black text-white">{t.number}</span></div><div className="text-[11px] font-bold text-zinc-200">{labels[t.status]}{t.items>0&&` · ${t.items} · ${t.total.toFixed(2)}€`}</div></Link>}</div>})}
   {editing&&<div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-zinc-700 bg-zinc-950/90 px-4 py-2 text-xs text-zinc-400">Arrastra mesas y barra y pulsa Guardar distribución</div>}
 </div></section>;
}