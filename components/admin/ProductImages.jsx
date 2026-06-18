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

    // ✅ Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage("❌ Image size should be less than 5MB");
      e.target.value = ""; // Reset input
      return;
    }

    // ✅ Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setMessage("❌ Please upload JPG, PNG, GIF, or WEBP images");
      e.target.value = ""; // Reset input
      return;
    }

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
        setMessage("✅ Image uploaded successfully");
      } else {
        setMessage("❌ Upload failed: " + (data.error?.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error uploading image");
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Product Images</h2>
      
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-500 transition">
        <input
          type="file"
          onChange={handleImageUpload}
          accept="image/*"
          className="w-full text-gray-700 bg-white"
          disabled={uploading}
        />
        <p className="text-xs text-gray-400 mt-2">
          JPG, PNG, GIF, WEBP (Max 5MB)
        </p>
      </div>
      
      {uploading && (
        <div className="flex items-center gap-2 mt-3 text-blue-500">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Uploading image...
        </div>
      )}
      
      {/* Image Grid */}
      <div className="flex gap-3 mt-4 flex-wrap">
        {images.length === 0 && !uploading && (
          <p className="text-gray-400 text-sm w-full text-center py-4">
            No images uploaded yet
          </p>
        )}
        {images.map((img, i) => (
          <div key={i} className="relative group">
            <Image
              src={img}
              alt={`Product image ${i + 1}`}
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => onRemoveImage(i)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600 transition flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      {/* Image Count */}
      {images.length > 0 && (
        <p className="text-xs text-gray-400 mt-2">
          {images.length} image{images.length > 1 ? 's' : ''} uploaded
        </p>
      )}
    </div>
  );
}