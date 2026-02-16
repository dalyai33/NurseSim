/**
 * Hooks for classes API. Use these when connecting the UI.
 * - useMyClass(): current user's class (for students; curriculum_level, etc.)
 * - useClasses(): teacher's list of classes (for teacher view)
 */
import { useState, useEffect, useCallback } from "react";
import type { Class } from "../api/classes";
import * as classesApi from "../api/classes";

export function useMyClass(): {
  class: Class | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [classData, setClassData] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClass = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await classesApi.getMyClass();
      if (res.ok) {
        setClassData(res.class ?? null);
      } else {
        setError("Could not load your class.");
      }
    } catch {
      setError("Could not reach the server.");
      setClassData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClass();
  }, [fetchClass]);

  return { class: classData, loading, error, refetch: fetchClass };
}

export function useClasses(): {
  classes: Class[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await classesApi.listClasses();
      if (res.ok) {
        setClasses(res.classes ?? []);
      } else {
        setError("Could not load classes.");
      }
    } catch {
      setError("Could not reach the server.");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return { classes, loading, error, refetch: fetchClasses };
}
