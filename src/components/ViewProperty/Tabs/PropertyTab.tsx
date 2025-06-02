import AirBnbPricing from "../AirBnbPricing";
import PropertyDetails from "../PropertyDetails";
import ImageSection from "../ImageSection";
import Amenities from "../Amenities";
import FeeSection, { AgencyFeeSection, PricePreview } from "../FeeSection";
import { useState } from "react";
import Spinner from "../../Spinner";

function PropertyTab({
  property,
  setProperty,
  handleUpdate,
  loading,
  newImages,
  setNewImages,
  loadingSync,
  edit,
  setEdit,
}: {
  property: any;
  setProperty: (property: any) => void;
  handleUpdate: (property: any) => void;
  loading: boolean;
  newImages: any[];
  setNewImages: React.Dispatch<React.SetStateAction<File[]>>;
  loadingSync: boolean;
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="my-4 flex flex-col lg:flex-row justify-center items-start gap-8 px-6">
      <div className="w-full max-w-xl">
        <PropertyDetails
          property={property}
          setProperty={setProperty}
          edit={edit}
          setEdit={setEdit}
        />
        <ImageSection
          property={property}
          setProperty={setProperty}
          edit={edit}
          newImages={newImages}
          setNewImages={setNewImages}
        />
        <Amenities property={property} setProperty={setProperty} edit={edit} />
        <FeeSection
          cautionFee={property.price.cautionFee}
          setCautionFee={(val) =>
            setProperty({
              ...property,
              price: { ...property.price, cautionFee: val },
            })
          }
          edit={edit}
        />
        <AgencyFeeSection
          agencyFee={property.agentFee}
          setAgencyFee={(val) =>
            setProperty({
              ...property,
              agentFee: val,
            })
          }
          edit={edit}
        />
        {showPreview && (
          <PricePreview
            basePrice={
              property?.defaultRate?.ratePrice || property?.price?.basePrice
            }
            cautionFee={property.price.cautionFee || 0}
          />
        )}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="mt-2 text-[#3498db] underline text-sm"
        >
          {showPreview ? "Hide Price Preview" : "Show Price Preview"}
        </button>
        <div className="flex items-center gap-4 my-6">
          <button
            disabled={loading}
            onClick={() => handleUpdate(property)}
            className={`px-3 py-2 text-white rounded-lg bg-primary text-sm font-medium ${
              !edit && "hidden"
            }`}
          >
            {loading ? <Spinner /> : "Save Changes"}
          </button>
        </div>
        <AirBnbPricing id={property._id} loading={loadingSync} />
      </div>
    </div>
  );
}

export default PropertyTab;
