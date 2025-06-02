import { useEffect, useState } from 'react';

const getUser = () => JSON.parse(localStorage.getItem("user") || "{}");

export const useCurrency = () => {
    const [currency, setCurrency] = useState<string>("");

    useEffect(() => {
        const user = getUser();
        setCurrency(user.country?.toLowerCase() !== "nigeria" ? "₦" : "₦");
    }, []);

    return currency;
};
