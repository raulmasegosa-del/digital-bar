"use client";

import { useRef, useState } from "react";
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

    // Vista previa inmediata
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
      <label className="block text-sm font-medium">
        Imagen
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        className="flex h-64 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-amber-500 hover:bg-amber-50"
      >
        {preview ? (
          <img
            src={preview}
            alt="Vista previa"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-center">
            <div className="text-6xl">📷</div>

            <p className="mt-4 font-medium">
              Haz clic para seleccionar una imagen
            </p>

            <p className="mt-2 text-sm text-gray-500">
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

      {/* Este campo es el que llega a createProduct() */}
      <input
        type="hidden"
        name="image"
        value={imageUrl}
        readOnly
      />

      {uploading && (
        <p className="text-sm text-amber-600">
          ⏳ Subiendo imagen...
        </p>
      )}

      {!uploading && imageUrl && (
        <p className="text-sm text-green-600">
          ✅ Imagen subida correctamente
        </p>
      )}
    </div>
  );
}