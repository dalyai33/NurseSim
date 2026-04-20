import { useState, useEffect, useCallback } from "react";
import type { MeUser } from "../lib/api";
import { getMe } from "../lib/api";

export function useMe(): {
  user: MeUser | null;
  loading: boolean;
  refetch: () => Promise<void>;
} {
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMe();
      if (res.ok) setUser(res.user ?? null);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return { user, loading, refetch: fetchMe };
}
