/**
 * Foundation: form to join a class by code. Connect this to your UI (e.g. landing when user has no class).
 * Uses classesApi.joinClass(); on success calls onJoined(class).
 */
import React, { useState } from "react";
import { joinClass } from "../../api/classes";
import type { Class } from "../../api/classes";

type Props = {
  onJoined: (c: Class) => void;
  onError?: (message: string) => void;
};

export const JoinClassForm: React.FC<Props> = ({ onJoined, onError }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await joinClass(code);
      if (res.ok && res.class) {
        onJoined(res.class);
      } else {
        const msg = (res as { error?: string }).error ?? "Invalid join code.";
        setError(msg);
        onError?.(msg);
      }
    } catch {
      const msg = "Could not reach the server.";
      setError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="join-class-code">Class code</label>
      <input
        id="join-class-code"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="e.g. ABC123"
        disabled={loading}
        aria-invalid={!!error}
      />
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={loading || !code.trim()}>
        {loading ? "Joining…" : "Join class"}
      </button>
    </form>
  );
};
