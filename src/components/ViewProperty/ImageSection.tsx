import cloud from "../../assets/cloud-upload-white.svg";
import graycancel from "../../assets/graycancel.svg";

function ImageSection({
  property,
  setProperty,
  edit,
  newImages,
  setNewImages,
}: {
  property: any;
  setProperty: any;
  edit: boolean;
  newImages: File[];
  setNewImages: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveImage = (index: number, isNew: boolean) => {
    if (isNew) {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setProperty((prev: any) => ({
        ...prev,
        images: prev.images.filter((_: any, i: number) => i !== index),
      }));
    }
  };

  return (
    <div className="my-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[#121212] font-medium text-lg">Images</h3>
      </div>
      <div className="flex overflow-x-auto w-full no-scrollbar py-4 relative">
        {/* Existing images */}
        {property.images.map((image: string, index: number) => (
          <div
            key={`existing-${index}`}
            className="relative min-w-32 min-h-28 rounded-xl border-2 border-white"
          >
            {edit && (
              <img
                src={graycancel}
                alt="cancel"
                onClick={() => handleRemoveImage(index, false)}
                className="absolute top-0 right-0 cursor-pointer"
              />
            )}
            <img
              src={image}
              alt="property"
              className="object-cover rounded-xl w-36 h-28"
            />
          </div>
        ))}

        {/* New images */}
        {newImages.map((file, index) => {
          const imageSrc = URL.createObjectURL(file);
          return (
            <div
              key={`new-${index}`}
              className="relative min-w-32 min-h-28 rounded-xl border-2 border-white"
            >
              <img
                src={graycancel}
                alt="cancel"
                onClick={() => handleRemoveImage(index, true)}
                className="absolute top-0 right-0 cursor-pointer"
              />
              <img
                src={imageSrc}
                alt="property"
                className="object-cover rounded-xl w-36 h-28"
              />
            </div>
          );
        })}

        {edit && (
          <span
            onClick={() => document.getElementById("file")?.click()}
            className="flex flex-col gap-1 items-center justify-center min-w-32 min-h-28 rounded-xl border-2 border-white text-white bg-[#C4C4C4] cursor-pointer"
          >
            <img src={cloud} alt="cloud" />
            <h4 className="text-xs font-light max-w-12 text-center">
              Add Pictures
            </h4>
            <input
              type="file"
              id="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleAddImages}
            />
          </span>
        )}
      </div>
    </div>
  );
}

export default ImageSection;
