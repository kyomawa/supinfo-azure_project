"use server";

import "server-only";

// =============================================================================================================================================

const apiUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:3000/api/" : "https://supinfo-azure-project.fr/api/";

// =============================================================================================================================================

interface FetchOptions {
  tags?: string[];
  headers?: Record<string, string>;
  body?: unknown;
  revalidateTime?: number;
}

const API_KEY_HEADER = "x-sap-secret-api-key";
const API_KEY = process.env.SAP_SECRET_API_KEY;

function getHeaders(body?: unknown, options?: FetchOptions): HeadersInit {
  const isServerSide = typeof window === "undefined";
  const headers: HeadersInit = {};

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (options?.headers) {
    Object.assign(headers, options.headers);
  }

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
      ...(options?.tags ? { tags: options.tags } : {}),
    },
    credentials: "include",
  });

  return handleResponse<T>(res);
}

// =============================================================================================================================================

async function post<T>(url: string, body: unknown, options?: FetchOptions): Promise<ApiResponse<T>> {
  const res = await fetch(`${apiUrl}${url}`, {
    method: "POST",
    headers: getHeaders(body, options),
    body: body instanceof FormData ? body : JSON.stringify(body),
    next: options?.tags ? { tags: options.tags } : undefined,
    credentials: "include",
  });

  return handleResponse<T>(res);
}

// =============================================================================================================================================

async function put<T>(url: string, body: unknown, options?: FetchOptions): Promise<ApiResponse<T>> {
  const res = await fetch(`${apiUrl}${url}`, {
    method: "PUT",
    headers: getHeaders(body, options),
    body: body instanceof FormData ? body : JSON.stringify(body),
    next: options?.tags ? { tags: options.tags } : undefined,
    credentials: "include",
  });

  return handleResponse<T>(res);
}

// =============================================================================================================================================

async function patch<T>(url: string, body: unknown, options?: FetchOptions): Promise<ApiResponse<T>> {
  const res = await fetch(`${apiUrl}${url}`, {
    method: "PATCH",
    headers: getHeaders(body, options),
    body: body instanceof FormData ? body : JSON.stringify(body),
    next: options?.tags ? { tags: options.tags } : undefined,
    credentials: "include",
  });

  return handleResponse<T>(res);
}

// =============================================================================================================================================

async function del<T>(url: string, options?: FetchOptions): Promise<ApiResponse<T>> {
  const res = await fetch(`${apiUrl}${url}`, {
    method: "DELETE",
    headers: getHeaders(options),
    next: options?.tags ? { tags: options.tags } : undefined,
    credentials: "include",
  });

  return handleResponse<T>(res);
}

// =============================================================================================================================================

async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
  try {
    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Une erreur est survenue.",
        data: null,
      };
    }

    return data;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return {
      success: false,
      message: "Invalid response from server.",
      data: null,
    };
  }
}

// =============================================================================================================================================

export { get, post, put, patch, del };
