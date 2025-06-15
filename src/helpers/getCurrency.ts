import { useEffect, useState } from 'react';
import Cookies from "js-cookie"

const getUser = () => JSON.parse(Cookies.get("user") || "{}");

export const useCurrency = () => {
    const [currency, setCurrency] = useState<string>("");

    useEffect(() => {
        const user = getUser();
        setCurrency(user.country?.toLowerCase() !== "nigeria" ? "₦" : "₦");
    }, []);

    return currency;
};
