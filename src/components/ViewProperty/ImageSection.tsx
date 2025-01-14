import cloud from "../../assets/cloud-upload-white.svg";
import graycancel from "../../assets/graycancel.svg";

function ImageSection({
  property,
  setProperty,
  edit,
}: {
  property: any;
  setProperty: any;
  edit: boolean;
}) {
  return (
    <div className="my-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[#121212] font-medium text-lg">Images</h3>
      </div>
      <div className="flex overflow-x-auto w-full no-scrollbar py-4 relative">
        {property?.images.map((image: any, index: number) => {
          const imageSrc =
            typeof image === "string" ? image : URL.createObjectURL(image);

          return (
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
                    setProperty((prev: any) => {
                      const newImages = prev.images.filter(
                        (_: any, i: number) => i !== index
                      );
                      return { ...prev, images: newImages };
                    })
                  }
                  className="absolute top-0 right-0 cursor-pointer"
                />
              )}
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
              multiple
              onChange={(e: any) => {
                const newImages = Array.from(e.target.files);
                setProperty((prev: any) => {
                  const updatedImages = [...prev.images, ...newImages].slice(
                    -10
                  );
                  return { ...prev, images: updatedImages };
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
