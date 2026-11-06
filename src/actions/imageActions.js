export const getImageLink = async (image) => {
  const formData = new FormData();

  formData.append("file", image);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
    {
      method: "POST",
      signal: AbortSignal.timeout(120000),
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error?.message || "Image upload failed");
  }

  const imgData = await response.json();

  return imgData.secure_url;
};
