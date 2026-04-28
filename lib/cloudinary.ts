import { v2 as cloudinary } from 'cloudinary';
/////////////////////////
// Configuration
/////////////////////////
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/////////////////////////
// Uploads image files
/////////////////////////
export const uploadImages = async (
  images: string[],
  folder: string
) => {

  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder,
  };

  const publicIds: string[] = [];
  const ids_urls: { public_id: string; secure_url: string }[] = [];

  for (const image of images) {
    try {
      const res = await cloudinary.uploader.upload(image, options);
      ids_urls.push({ public_id: res.public_id, secure_url: res.secure_url });
      publicIds.push(res.public_id);
    } catch (error) {
      // Attempt rollback
      if (publicIds.length > 0) {
        try {
          await deleteImages(publicIds);
        } catch (cleanupError) {
          console.error(
            'Failed to cleanup uploaded images:',
            cleanupError
          );
        }
      }

      const uploadMessage =
        error instanceof Error
          ? error.message
          : 'Unknown error uploading image';

      console.error(`Error uploading image (${image}):`, uploadMessage);

      throw new Error(`Upload failed for ${image}: ${uploadMessage}`);
    }
  }

  return ids_urls;
};

/////////////////////////
// Deletes images
/////////////////////////
export const deleteImages = async (publicIds: string[]) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    console.log('Deleted images:', result);
    return result;
  } catch (error) {
    console.error('Error deleting images:', error);
    throw error;
  }
};
