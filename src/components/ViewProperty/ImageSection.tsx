import cloud from "../../assets/cloud-upload-white.svg";
import graycancel from "../../assets/graycancel.svg";

function ImageSection({
  images,
  setImages,
  edit,
}: {
  images: any;
  setImages: any;
  edit: boolean;
}) {
  return (
    <div className="my-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[#121212] font-medium text-lg">Images</h3>
      </div>
      <div className="flex overflow-x-auto w-full no-scrollbar py-4 relative">
        {images.map((image: any, index: number) => (
          <div
            key={index}
            style={{
              transform:
                index === 0
                  ? ""
                  : index % 2 === 0
                  ? "rotate(-10deg)"
                  : "rotate(10deg)",
              zIndex: index % 2 === 0 ? 1 : 0,
            }}
            className="relative min-w-32 min-h-28 rounded-xl border-2 border-white"
          >
            {edit && (
              <img
                src={graycancel}
                alt="cancel"
                onClick={() =>
                  setImages(images.filter((img: any) => img !== image))
                }
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
        {edit && (
          <span
            onClick={() => {
              const fileInput = document.getElementById("file");
              if (fileInput) {
                fileInput.click();
              }
            }}
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
              onChange={(e: any) => {
                const newImage = URL.createObjectURL(e.target.files[0]);

                setImages((prev: any) => {
                  if (prev.length < 3) {
                    return [...prev, newImage];
                  } else {
                    // Remove the first image and add the new one
                    return [...prev.slice(1), newImage];
                  }
                });
              }}
            />
          </span>
        )}
      </div>
    </div>
  );
}

export default ImageSection;
