"use client";

import { useRef, useState } from "react";
import { Camera, Check, Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

type Props = {
  image?: string | null;
};

export default function ImageUpload({ image }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState(image ?? "");
  const [imageUrl, setImageUrl] = useState(image ?? "");
  const [uploading, setUploading] = useState(false);

  async function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const extension = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${extension}`;

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      setImageUrl(data.publicUrl);
    } catch (err) {
      console.error(err);
      alert("Error subiendo la imagen.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-300">
        Imagen
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        className="
          relative
          flex
          h-72
          cursor-pointer
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          border
          border-dashed
          border-zinc-700
          bg-[#151413]
          transition
          hover:border-amber-500/50
          hover:bg-[#1a1816]
        "
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Vista previa"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-x-0 bottom-0 bg-black/60 px-4 py-3 text-center text-xs text-zinc-300">
              Haz clic para cambiar la imagen
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <Camera size={25} strokeWidth={1.6} />
            </div>

            <p className="mt-4 text-sm font-medium text-zinc-300">
              Seleccionar imagen
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              JPG · PNG · WEBP
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      <input
        type="hidden"
        name="image"
        value={imageUrl}
        readOnly
      />

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-amber-500">
          <Loader2 size={15} className="animate-spin" />
          Subiendo imagen...
        </div>
      )}

      {!uploading && imageUrl && (
        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <Check size={15} />
          Imagen subida correctamente
        </div>
      )}
    </div>
  );
}