import { Expense, Group } from "@/types";

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:8080";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = isJson ? await res.json() : await res.text();
      if (isJson && (data as any)?.error) message = (data as any).error;
      else if (typeof data === "string" && data) message = data;
    } catch (_) {}
    throw new Error(message);
  }

  return isJson ? (await res.json()) as T : (undefined as unknown as T);
}

export const api = {
  getGroups: () => apiFetch<Group[]>(`/api/groups`),
  createGroup: (group: Group) =>
    apiFetch<{ status: string }>(`/api/groups`, {
      method: "POST",
      body: JSON.stringify(group),
    }),

  getExpenses: (gid: string) => apiFetch<Expense[]>(`/api/groups/${gid}/expenses`),
  createExpense: (gid: string, expense: Expense) =>
    apiFetch<{ status: string }>(`/api/groups/${gid}/expenses`, {
      method: "POST",
      body: JSON.stringify(expense),
    }),

  getSettlements: (gid: string) => apiFetch<
    { from: { value: string }; to: { value: string }; amount: number; currency: string }[]
  >(`/api/groups/${gid}/settlements`),
};
