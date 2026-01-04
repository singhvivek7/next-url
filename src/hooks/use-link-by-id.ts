import { keepPreviousData,useQuery } from "@tanstack/react-query"

import { axiosInstance } from "@/lib/helper/request";
import { queryKeys } from "@/query-keys";
import { ILink } from "@/types/links.types";

export const useLinkById = (id: string, params?: { start?: string, end?: string }, options: { enabled?: boolean } = {}) => {
    return useQuery<{
        message: string;
        data: ILink;
    }>({
        queryKey: [queryKeys.LINK, id, params],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (params?.start) queryParams.append("start", params.start);
            if (params?.end) queryParams.append("end", params.end);
            const response = await axiosInstance.get(`/api/v1/links/${id}?${queryParams.toString()}`)
            return response.data
        },
        placeholderData: keepPreviousData,
        enabled: !!id && (options.enabled !== undefined ? options.enabled : true)
    });
}