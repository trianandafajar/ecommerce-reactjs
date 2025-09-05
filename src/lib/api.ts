// src/utils/api.ts
import api from "./axios"; // file axios yang sudah pakai cookie

interface RequestOptions {
  params?: Record<string, any>;
  data?: Record<string, any>;
  headers?: Record<string, any>;
}

export const GET = async <T = any>(url: string, options?: RequestOptions): Promise<T> => {
  const response = await api.get(url, { params: options?.params, headers: options?.headers });
  return response.data;
};

export const POST = async <T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> => {
  const response = await api.post(url, data, { headers: options?.headers });
  return response.data;
};

export const PUT = async <T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> => {
  const response = await api.put(url, data, { headers: options?.headers });
  return response.data;
};

export const DELETE = async <T = any>(url: string, options?: RequestOptions): Promise<T> => {
  const response = await api.delete(url, { headers: options?.headers });
  return response.data;
};
