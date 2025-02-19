import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useCurrency } from "@/hooks/use-get-currency";

export default function useListPrice (edit: boolean, property: any, setProperty: any) {
  const currency = useCurrency();

  const parseNumberInput = useCallback((value: string) => {
    return value.replace(/[^0-9.]/g, "");
  }, []);

  const calculatedPrices = useMemo(() => {
    const basePrice = property.price.basePrice || 0;
    const discountPercentage = property.price.discountPercentage || 0;
    const boostPercentage = property.price.boostPercentage || 0;

    const calculatedDiscountedPrice = Math.min(
      basePrice,
      basePrice * (1 + discountPercentage / 100)
    );
    const calculatedBoostedPrice = basePrice * (1 + boostPercentage / 100);

    return {
      discountedPrice: Math.max(0, Number(calculatedDiscountedPrice.toFixed(2))),
      boostedPrice: Number(calculatedBoostedPrice.toFixed(2)),
    };
  }, [
    property.price.basePrice,
    property.price.discountPercentage,
    property.price.boostPercentage,
  ]);

  const handleBasePrice = useCallback(
    (value: string) => {
      const numericValue = parseNumberInput(value);
      setProperty((prev: any) => ({
        ...prev,
        price: {
          ...prev.price,
          basePrice: Number(numericValue),
          discountedPrice: undefined,
          boostedPrice: undefined,
        },
      }));
    },
    [parseNumberInput, setProperty]
  );

  const handleDiscountedPrice = useCallback(
    (value: string) => {
      const numericValue = parseNumberInput(value);
      const basePrice = property.price.basePrice;
      let validDiscountedPrice = Number(numericValue);

      if (basePrice <= 0) return;

      if (validDiscountedPrice > basePrice) {
        toast.error("Discounted price cannot exceed base price");
        validDiscountedPrice = Math.min(validDiscountedPrice, basePrice);
      }

      const discountPercentage =
        ((basePrice - validDiscountedPrice) / basePrice) * 100;

      setProperty((prev: any) => ({
        ...prev,
        price: {
          ...prev.price,
          discountedPrice: validDiscountedPrice,
          discountPercentage: -Math.min(
            Math.abs(Number(discountPercentage.toFixed(2))),
            100
          ),
        },
      }));
    },
    [parseNumberInput, property.price.basePrice, setProperty]
  );

  const handleBoostedPrice = useCallback(
    (value: string) => {
      const numericValue = parseNumberInput(value);
      const basePrice = property.price.basePrice;

      if (basePrice <= 0) return;

      const boostPercentage =
        ((Number(numericValue) - basePrice) / basePrice) * 100;

      setProperty((prev: any) => ({
        ...prev,
        price: {
          ...prev.price,
          boostedPrice: Number(numericValue),
          boostPercentage: Math.max(Number(boostPercentage.toFixed(2))),
        },
      }));
    },
    [parseNumberInput, property.price.basePrice, setProperty]
  );

  const handleDiscountPercentage = useCallback(
    (value: number) => {
      if (!edit) return;
      const clampedValue = Math.max(-100, Math.min(0, -Math.abs(value)));

      setProperty((prev: any) => ({
        ...prev,
        price: {
          ...prev.price,
          discountPercentage: clampedValue,
          discountedPrice: undefined,
        },
      }));
    },
    [edit, setProperty]
  );

  const handleBoostPercentage = useCallback(
    (value: number) => {
      if (!edit) return;
      const clampedValue = Math.max(0, value);

      setProperty((prev: any) => ({
        ...prev,
        price: {
          ...prev.price,
          boostPercentage: clampedValue,
          boostedPrice: undefined,
        },
      }));
    },
    [edit, setProperty]
  );

  const handleAirbnbPrice = useCallback(
    (value: string) => {
      const rawValue = value.replace(/,/g, "");
      if (!isNaN(Number(rawValue))) {
        setProperty((prev: any) => ({
          ...prev,
          price: {
            ...prev.price,
            airbnbPrice: Number(rawValue),
          },
        }));
      }
    },
    [setProperty]
  );

  return {
    currency,
    calculatedPrices,
    handleBasePrice,
    handleDiscountedPrice,
    handleBoostedPrice,
    handleDiscountPercentage,
    handleBoostPercentage,
    handleAirbnbPrice,
  };
};