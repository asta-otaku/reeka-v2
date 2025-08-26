/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import apiClient from "../helpers/apiClient";

type OrgSettings = {
  organizationDefaultCurrency?: "NGN" | "USD";
};

const currencySymbolMap: Record<string, string> = {
  NGN: "₦",
  USD: "$",
};

const useStore: any = create((set: any, get: any) => ({
  // Modal
  currentModal: null,
  setModal: (newModal: any) =>
    set((state: any) => ({ ...state, currentModal: newModal })),

  // Org settings + currency
  orgSettings: null as OrgSettings | null,
  currencyCode: "NGN" as "NGN" | "USD",
  currencySymbol: "₦",

  setOrgSettings: (settings: OrgSettings) => {
    const code = (settings.organizationDefaultCurrency || "NGN") as
      | "NGN"
      | "USD";
    set({
      orgSettings: settings,
      currencyCode: code,
      currencySymbol: currencySymbolMap[code] || "₦",
    });
  },

  fetchOrgSettings: async () => {
    try {
      const res = await apiClient.get("/users/org-settings");
      const settings: OrgSettings = res.data || {};
      get().setOrgSettings(settings);
      return settings;
    } catch (_e) {
      // If request fails (e.g., unauthenticated), keep defaults
      return null;
    }
  },
}));

export default useStore;