"use server";

import "server-only";
import { apiUrl } from "@/constants/data";

// =============================================================================================================================================

interface FetchOptions {
  tag?: string;
  headers?: Record<string, string>;
  body?: unknown;
  revalidateTime?: number;
}

const API_KEY_HEADER = "x-sap-secret-api-key";
const API_KEY = process.env.SAP_SECRET_API_KEY;

function getHeaders(options?: FetchOptions): HeadersInit {
  const isServerSide = typeof window === "undefined";
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  if (isServerSide && API_KEY) {
    headers[API_KEY_HEADER] = API_KEY;
  }

  return headers;
}

// =============================================================================================================================================

async function get<T>(url: string, options?: FetchOptions): Promise<ApiResponse<T>> {
  const revalidateTime = options?.revalidateTime || 3600;

  const res = await fetch(`${apiUrl}${url}`, {
    method: "GET",
    headers: getHeaders(options),
    next: {
      revalidate: revalidateTime,
      ...(options?.tag ? { tags: [options.tag] } : {}),
    },
    credentials: "include",
  });

  return handleResponse<T>(res);
}

// =============================================================================================================================================

async function post<T>(url: string, body: unknown, options?: FetchOptions): Promise<ApiResponse<T>> {
  const res = await fetch(`${apiUrl}${url}`, {
    method: "POST",
    headers: getHeaders(options),
    body: JSON.stringify(body),
    next: options?.tag ? { tags: [options.tag] } : undefined,
    credentials: "include",
  });

  return handleResponse<T>(res);
}

// =============================================================================================================================================

async function put<T>(url: string, body: unknown, options?: FetchOptions): Promise<ApiResponse<T>> {
  const res = await fetch(`${apiUrl}${url}`, {
    method: "PUT",
    headers: getHeaders(options),
    body: JSON.stringify(body),
    next: options?.tag ? { tags: [options.tag] } : undefined,
    credentials: "include",
  });

  return handleResponse<T>(res);
}

// =============================================================================================================================================

async function patch<T>(url: string, body: unknown, options?: FetchOptions): Promise<ApiResponse<T>> {
  const res = await fetch(`${apiUrl}${url}`, {
    method: "PATCH",
    headers: getHeaders(options),
    body: JSON.stringify(body),
    next: options?.tag ? { tags: [options.tag] } : undefined,
    credentials: "include",
  });

  return handleResponse<T>(res);
}

// =============================================================================================================================================

async function del<T>(url: string, options?: FetchOptions): Promise<ApiResponse<T>> {
  const res = await fetch(`${apiUrl}${url}`, {
    method: "DELETE",
    headers: getHeaders(options),
    next: options?.tag ? { tags: [options.tag] } : undefined,
    credentials: "include",
  });

  return handleResponse<T>(res);
}

// =============================================================================================================================================

async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
  let data;
  try {
    data = await res.json();
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return {
      success: false,
      message: "Invalid response from server.",
      data: null,
    };
  }

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Une erreur est survenue.",
      data: null,
    };
  }

  return data;
}

// =============================================================================================================================================

export { get, post, put, patch, del };
