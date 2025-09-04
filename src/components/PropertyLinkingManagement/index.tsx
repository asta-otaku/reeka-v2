import { useState } from "react";
import toast from "react-hot-toast";
import apiClient from "../../helpers/apiClient";
import { Property, LinkedPropertyResponse } from "./types";
import Header from "./Header";
import MasterPropertySelector from "./MasterPropertySelector";
import ConstituentPropertySelector from "./ConstituentPropertySelector";
import LinkedPropertiesViewer from "./LinkedPropertiesViewer";
import LinkSummary from "./LinkSummary";

interface PropertyLinkingManagementProps {
  setStep: (step: number) => void;
  properties: Property[];
  onPropertiesChange: () => void;
}

function PropertyLinkingManagement({
  setStep,
  properties,
  onPropertiesChange,
}: PropertyLinkingManagementProps) {
  const [masterPropertyId, setMasterPropertyId] = useState<string>("");
  const [selectedConstituentIds, setSelectedConstituentIds] = useState<
    string[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPropertyForView, setSelectedPropertyForView] =
    useState<string>("");
  const [linkedProperties, setLinkedProperties] =
    useState<LinkedPropertyResponse | null>(null);
  const [loadingLinkedProperties, setLoadingLinkedProperties] = useState(false);
  const [unlinkingPropertyId, setUnlinkingPropertyId] = useState<string>("");

  // Get linked properties for a specific property
  const fetchLinkedProperties = async (propertyId: string) => {
    try {
      setLoadingLinkedProperties(true);
      const response = await apiClient.get(
        `/properties/get-linked-properties/${propertyId}`
      );
      setLinkedProperties(response.data);
    } catch (error: any) {
      console.error("Error fetching linked properties:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch linked properties"
      );
      setLinkedProperties(null);
    } finally {
      setLoadingLinkedProperties(false);
    }
  };

  // Unlink all properties under a master (takes master property ID)
  const handleUnlinkAllProperties = async (masterPropertyId: string) => {
    try {
      setUnlinkingPropertyId(masterPropertyId);
      await apiClient.delete(
        `/properties/unlink-properties/${masterPropertyId}`
      );
      toast.success("All properties unlinked successfully!");

      // Clear the view and reset selection
      setLinkedProperties(null);
      setSelectedPropertyForView("");

      // Navigate back to step 1 and refresh properties
      setTimeout(() => {
        setStep(1);
        onPropertiesChange();
      }, 1500);
    } catch (error: any) {
      console.error("Error unlinking properties:", error);
      toast.error(
        error.response?.data?.message || "Failed to unlink properties"
      );
    } finally {
      setUnlinkingPropertyId("");
    }
  };

  const handleConstituentToggle = (propertyId: string) => {
    setSelectedConstituentIds((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleLinkProperties = async () => {
    if (!masterPropertyId) {
      toast.error("Please select a master property");
      return;
    }

    if (selectedConstituentIds.length === 0) {
      toast.error("Please select at least one constituent property");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post("/properties/link-properties", {
        masterPropertyId,
        constituentPropertyIds: selectedConstituentIds,
      });

      toast.success("Properties linked successfully!");

      // Reset form
      setMasterPropertyId("");
      setSelectedConstituentIds([]);

      // Navigate back to step 1 and refresh properties
      setTimeout(() => {
        setStep(1);
        onPropertiesChange();
      }, 1500);
    } catch (error: any) {
      console.error("Error linking properties:", error);
      toast.error(error.response?.data?.message || "Failed to link properties");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="px-4 md:px-6 py-8">
        <Header setStep={setStep} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <MasterPropertySelector
            properties={properties}
            masterPropertyId={masterPropertyId}
            setMasterPropertyId={setMasterPropertyId}
          />

          <ConstituentPropertySelector
            properties={properties}
            masterPropertyId={masterPropertyId}
            selectedConstituentIds={selectedConstituentIds}
            handleConstituentToggle={handleConstituentToggle}
          />
        </div>

        <LinkedPropertiesViewer
          properties={properties}
          selectedPropertyForView={selectedPropertyForView}
          setSelectedPropertyForView={setSelectedPropertyForView}
          linkedProperties={linkedProperties}
          loadingLinkedProperties={loadingLinkedProperties}
          unlinkingPropertyId={unlinkingPropertyId}
          handleUnlinkAllProperties={handleUnlinkAllProperties}
          fetchLinkedProperties={fetchLinkedProperties}
        />

        {masterPropertyId && selectedConstituentIds.length > 0 && (
          <LinkSummary
            masterPropertyId={masterPropertyId}
            selectedConstituentIds={selectedConstituentIds}
            properties={properties}
            isLoading={isLoading}
            handleLinkProperties={handleLinkProperties}
          />
        )}
      </div>
    </div>
  );
}

export default PropertyLinkingManagement;
