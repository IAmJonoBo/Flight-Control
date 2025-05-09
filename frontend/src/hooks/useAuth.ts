import { useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  // Placeholder for auth logic
  return { user, setUser };
}
