import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/helper/request";

export const useTransactions = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['transactions', page, limit],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/transactions?page=${page}&limit=${limit}`);
            return data;
        }
    });
}
