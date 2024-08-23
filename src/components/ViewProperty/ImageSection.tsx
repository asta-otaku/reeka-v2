import cloud from "../../assets/cloud-upload-white.svg";

function ImageSection({ images, setImages }: { images: any; setImages: any }) {
  return (
    <div className="my-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[#121212] font-medium text-lg">Images</h3>
        <button className="text-[#808080] text-xs font-medium">Edit</button>
      </div>
      <div className="flex overflow-x-auto w-full no-scrollbar py-4">
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
            <img
              src={image}
              alt="property"
              className="object-cover rounded-xl w-36 h-28"
            />
          </div>
        ))}
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
              setImages((prev: any) => [
                ...prev,
                URL.createObjectURL(e.target.files[0]),
              ]);
            }}
          />
        </span>
      </div>
    </div>
  );
}

export default ImageSection;
