import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date: string | number | Date) => {
    return dayjs(date).tz("Asia/Kolkata").format("DD MMM YYYY, h:mm A");
}

export const formatPrice = (price: number) => {
    if (price === -1) return "Custom";
    return price.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
    });
}