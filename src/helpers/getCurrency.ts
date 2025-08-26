/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import useStore from "../store";

export const useCurrency = () => {
  const currencySymbol = useStore((s: any) => s.currencySymbol);
  const fetchOrgSettings = useStore((s: any) => s.fetchOrgSettings);

  useEffect(() => {
    // Attempt to fetch org settings once for authenticated flows
    fetchOrgSettings?.();
  }, []);

  return currencySymbol;
};

export const useCurrencyCode = () => {
  const currencyCode = useStore((s: any) => s.currencyCode);
  const fetchOrgSettings = useStore((s: any) => s.fetchOrgSettings);

  useEffect(() => {
    fetchOrgSettings?.();
  }, []);

  return currencyCode as "NGN" | "USD";
};