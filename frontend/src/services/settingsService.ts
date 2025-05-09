// Mock implementation for advanced settings service
export interface AdvancedSettings {
  param: string;
}

export async function getAdvancedSettings(): Promise<AdvancedSettings> {
  const res = await fetch("/settings/advanced");
  if (!res.ok) throw new Error("Failed to fetch advanced settings");
  return res.json();
}

export async function saveAdvancedSettings(
  settings: AdvancedSettings,
): Promise<void> {
  const res = await fetch("/settings/advanced", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Failed to save settings");
}
