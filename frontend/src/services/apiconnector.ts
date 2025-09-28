import axios, { AxiosRequestConfig, Method } from "axios";

// Axios instance with base URL and credentials
export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // Allows cookies to be sent and received
});

// Typed API connector function
export const apiConnector = <T = any>(
  method: Method,
  url: string,
  bodyData?: any,
  headers?: Record<string, string>,
  params?: Record<string, any>
): Promise<T> => {
  const config: AxiosRequestConfig = {
    method,
    url,
    data: bodyData || null,
    headers: headers || {},
    params: params || {},
    withCredentials: true,
  };

  return axiosInstance(config).then((res) => res.data as T);
};
