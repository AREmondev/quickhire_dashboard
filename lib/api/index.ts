
import axiosInstance from "@/lib/axios";

export const get = async <T>(url: string, params?: any): Promise<T> => {
  const response = await axiosInstance.get<T>(url, { params });
  return response.data;
};
