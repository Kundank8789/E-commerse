import Image from "next/image";

export default function ProductImages({ 
  images, 
  uploading, 
  onImageUpload, 
  onRemoveImage, 
  setUploading,
  setMessage 
}) {
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      setUploading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data?.secure_url) {
        onImageUpload(data.secure_url);
        setMessage("✅ Image uploaded");
      } else {
        setMessage("❌ Upload failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error uploading");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Product Images</h2>
      
      <input
        type="file"
        onChange={handleImageUpload}
        accept="image/*"
        className="border p-2 rounded w-full text-gray-700 bg-white"
      />
      
      {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
      
      <div className="flex gap-2 mt-3 flex-wrap">
        {images.map((img, i) => (
          <div key={i} className="relative">
            <Image
              src={img}
              alt="product"
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => onRemoveImage(i)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}