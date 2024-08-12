import imageIcon from "../../assets/image.svg";
import cloud from "../../assets/cloud-upload.svg";
import graycancel from "../../assets/graycancel.svg";
import { useEffect, useState } from "react";

function ImageUpload({
  toggleSection,
  openSection,
  formDetails,
  setFormDetails,
}: {
  toggleSection: any;
  openSection: any;
  formDetails: any;
  setFormDetails: any;
}) {
  const [images, setImages] = useState<any>([]);

  useEffect(() => {
    setFormDetails({
      ...formDetails,
      images: [...images],
    });
  }, [images]);

  return (
    <div
      onClick={() => toggleSection("images")}
      className="rounded-xl bg-[#FAFAFA] border flex flex-col gap-4 cursor-pointer mx-2 p-4"
    >
      <div className="flex gap-2 items-center">
        <img src={imageIcon} />
        <h3 className="text-primary font-medium">Images</h3>
      </div>
      {openSection === "images" && (
        <div onClick={(e) => e.stopPropagation()}>
          <div className="flex overflow-x-auto gap-4 no-scrollbar py-4">
            {images.map((image: any, index: number) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  className="min-w-32 h-32 object-cover bg-[#FAFAFA] rounded-lg"
                />
                <img
                  src={graycancel}
                  className="absolute -top-1.5 right-0 cursor-pointer"
                  onClick={() => {
                    setImages((prev: any) =>
                      prev.filter((_: any, i: number) => i !== index)
                    );
                  }}
                />
              </div>
            ))}
          </div>
          <div
            onClick={() => {
              const fileInput = document.getElementById("file");
              if (fileInput) {
                fileInput.click();
              }
            }}
            className="flex flex-col gap-2 items-center justify-center bg-[#FAFAFA] border-[#E1E1E1] border h-28 border-dashed rounded-2xl"
          >
            <img src={cloud} alt="cloudboost" />
            <h4 className="text-xs text-[#6D6D6D] font-light">
              Click here to upload file
            </h4>
            <input
              type="file"
              id="file"
              className="hidden"
              onChange={(e: any) => {
                setImages((prev: any) => [...prev, e.target.files[0]]);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
