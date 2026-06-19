import {
  Application,
  ApplicationFormData,
  ApplicationsResponse,
  ApplicationStatus,
} from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BASE_URL = `${(import.meta as any).env.VITE_API_URL ?? ""}/api`;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    const message =
      data?.details?.join(", ") ?? data?.error ?? "Something went wrong";
    throw new Error(message);
  }

  return data as T;
}

export interface GetApplicationsParams {
  status?: ApplicationStatus | "";
  search?: string;
  page?: number;
  limit?: number;
}

export const api = {
  getApplications: (
    params: GetApplicationsParams = {},
  ): Promise<ApplicationsResponse> => {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return request<ApplicationsResponse>(`/applications${qs ? `?${qs}` : ""}`);
  },

  getApplication: (id: string): Promise<{ data: Application }> =>
    request<{ data: Application }>(`/applications/${id}`),

  createApplication: (
    body: ApplicationFormData,
  ): Promise<{ data: Application }> =>
    request<{ data: Application }>("/applications", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateApplication: (
    id: string,
    body: Partial<ApplicationFormData>,
  ): Promise<{ data: Application }> =>
    request<{ data: Application }>(`/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deleteApplication: (id: string): Promise<{ message: string }> =>
    request<{ message: string }>(`/applications/${id}`, { method: "DELETE" }),
};
