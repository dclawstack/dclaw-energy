export interface EnergyReport {
  id: string;
  facility_id: string;
  period: string;
  total_kwh: number;
  peak_hours: string[];
  wastage_estimate: string;
  savings_opportunities: string[];
  created_at: string;
}

export interface HourlyData {
  hour: string;
  kwh: number;
}

export async function api<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `/api/v1${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  const res = await fetch(url, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}
