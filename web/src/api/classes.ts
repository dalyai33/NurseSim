/**
 * Classes API client. All calls use session (credentials: include).
 * Connect UI to these functions and hooks (useMyClass, useClasses).
 */
import { apiFetch } from "../lib/api";

export type Class = {
  id: number;
  teacher_id: number;
  name: string;
  join_code: string;
  /** List of curriculum levels (1, 2, 3) this class can access. */
  curriculum_levels: number[];
};

export type ClassesResponse = { ok: boolean; classes: Class[] };
export type ClassResponse = { ok: boolean; class: Class | null };
export type CreateClassResponse = { ok: boolean; class: Class };
export type JoinClassResponse = { ok: boolean; class: Class; message?: string };

export type ClassStudent = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

export type ClassStudentsResponse = { ok: boolean; students: ClassStudent[] };

/** Get one class by id (teacher must own it). */
export async function getClass(classId: number): Promise<ClassResponse> {
  const { data } = await apiFetch<ClassResponse>(`/api/classes/${classId}`);
  return data;
}

/** List students in a class (teacher only). */
export async function getClassStudents(classId: number): Promise<ClassStudentsResponse> {
  const { data } = await apiFetch<ClassStudentsResponse>(`/api/classes/${classId}/students`);
  return data;
}

/** List classes for the current teacher. */
export async function listClasses(): Promise<ClassesResponse> {
  const { data } = await apiFetch<ClassesResponse>("/api/classes");
  return data;
}

/** Create a class (teacher only). Returns the new class with join_code. */
export async function createClass(params: {
  name: string;
  curriculum_levels?: number[];
}): Promise<CreateClassResponse> {
  const levels = params.curriculum_levels?.length
    ? params.curriculum_levels.filter((l) => l >= 1 && l <= 3)
    : [1];
  const { data } = await apiFetch<CreateClassResponse>("/api/classes", {
    method: "POST",
    body: {
      name: params.name.trim(),
      curriculum_levels: levels.length ? levels : [1],
    },
  });
  return data;
}

/** Join a class by code (student). */
export async function joinClass(code: string): Promise<JoinClassResponse> {
  const { data } = await apiFetch<JoinClassResponse>("/api/classes/join", {
    method: "POST",
    body: { code: code.trim() },
  });
  return data;
}

/** Get the current user's class (the one they're enrolled in). */
export async function getMyClass(): Promise<ClassResponse> {
  const { data } = await apiFetch<ClassResponse>("/api/classes/me");
  return data;
}
