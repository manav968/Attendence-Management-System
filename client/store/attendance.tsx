import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Student = {
  id: string;
  name: string;
  course: string;
  faceImages: string[]; // data URLs captured during registration
};

export type Session = {
  id: string; // e.g. 2025-09-07_CS101_Morning
  name: string; // Human readable (e.g. CS101 - Morning)
  course: string;
  date: string; // ISO date (yyyy-mm-dd)
};

export type AttendanceLog = {
  id: string;
  studentId: string;
  sessionId: string;
  timestamp: number;
  method: "face" | "manual";
  livenessPassed?: boolean;
};

export type AttendanceState = {
  students: Student[];
  sessions: Session[];
  logs: AttendanceLog[];
};

const STORAGE_KEY = "smart_attendance_state_v1";

const seedStudents: Student[] = [
  { id: "STU-1001", name: "Aarav Mehta", course: "CS101", faceImages: [] },
  { id: "STU-1002", name: "Sara Khan", course: "CS101", faceImages: [] },
  { id: "STU-1003", name: "Ishaan Patel", course: "EE205", faceImages: [] },
];

const initialState: AttendanceState = {
  students: seedStudents,
  sessions: [],
  logs: [],
};

function loadState(): AttendanceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as AttendanceState;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

function saveState(state: AttendanceState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`;
}

export type AttendanceContextValue = AttendanceState & {
  addStudent: (s: Omit<Student, "faceImages"> & { faceImages?: string[] }) => void;
  addSession: (s: Omit<Session, "id"> & { id?: string }) => string;
  captureFaceForStudent: (studentId: string, imageDataUrl: string) => void;
  markAttendance: (args: { studentId: string; sessionId: string; method: AttendanceLog["method"]; livenessPassed?: boolean }) => void;
  exportLogsCSV: (filter?: { from?: Date; to?: Date; sessionId?: string; course?: string }) => string; // returns data URL
  clearAll: () => void;
};

const AttendanceContext = createContext<AttendanceContextValue | null>(null);

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AttendanceState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addStudent: AttendanceContextValue["addStudent"] = (s) => {
    setState((prev) => {
      if (prev.students.some((x) => x.id === s.id)) return prev; // avoid dupes
      const student: Student = { ...s, faceImages: s.faceImages ?? [] };
      return { ...prev, students: [...prev.students, student] };
    });
  };

  const addSession: AttendanceContextValue["addSession"] = (s) => {
    const id = s.id ?? `${s.date}_${s.course}_${s.name.replace(/\s+/g, "-")}`;
    setState((prev) => {
      if (prev.sessions.some((x) => x.id === id)) return prev;
      const session: Session = { id, ...s };
      return { ...prev, sessions: [...prev.sessions, session] };
    });
    return id;
  };

  const captureFaceForStudent: AttendanceContextValue["captureFaceForStudent"] = (studentId, image) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId ? { ...s, faceImages: [...s.faceImages, image] } : s,
      ),
    }));
  };

  const markAttendance: AttendanceContextValue["markAttendance"] = ({ studentId, sessionId, method, livenessPassed }) => {
    setState((prev) => ({
      ...prev,
      logs: [
        ...prev.logs,
        { id: uid("log"), studentId, sessionId, timestamp: Date.now(), method, livenessPassed },
      ],
    }));
  };

  const exportLogsCSV: AttendanceContextValue["exportLogsCSV"] = (filter) => {
    const rows = [
      ["log_id", "timestamp_iso", "student_id", "student_name", "course", "session_id", "method", "liveness"] as const,
    ];

    const filtered = state.logs.filter((log) => {
      const t = log.timestamp;
      const okFrom = filter?.from ? t >= filter.from.getTime() : true;
      const okTo = filter?.to ? t <= filter.to.getTime() : true;
      const okSession = filter?.sessionId ? log.sessionId === filter.sessionId : true;
      return okFrom && okTo && okSession;
    });

    const studentsById = Object.fromEntries(state.students.map((s) => [s.id, s]));
    const sessionsById = Object.fromEntries(state.sessions.map((s) => [s.id, s]));

    for (const log of filtered) {
      const student = studentsById[log.studentId];
      const session = sessionsById[log.sessionId];
      if (filter?.course && session?.course !== filter.course) continue;
      rows.push([
        log.id,
        new Date(log.timestamp).toISOString(),
        log.studentId,
        student?.name ?? "",
        student?.course ?? session?.course ?? "",
        log.sessionId,
        log.method,
        String(log.livenessPassed ?? ""),
      ] as unknown as typeof rows[number]);
    }

    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    return `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
  };

  const clearAll = () => setState(initialState);

  const value: AttendanceContextValue = useMemo(
    () => ({ ...state, addStudent, addSession, captureFaceForStudent, markAttendance, exportLogsCSV, clearAll }),
    [state],
  );

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
}

export function useAttendance() {
  const ctx = useContext(AttendanceContext);
  if (!ctx) throw new Error("useAttendance must be used within AttendanceProvider");
  return ctx;
}

export function useStats() {
  const { logs, sessions, students } = useAttendance();
  const byCourse: Record<string, { present: number; total: number }> = {};

  for (const s of sessions) {
    byCourse[s.course] ??= { present: 0, total: 0 };
    const roster = students.filter((st) => st.course === s.course).length;
    byCourse[s.course].total += roster;
  }

  for (const log of logs) {
    const session = sessions.find((s) => s.id === log.sessionId);
    if (!session) continue;
    byCourse[session.course] ??= { present: 0, total: 0 };
    byCourse[session.course].present += 1;
  }

  return {
    byCourse,
    totalStudents: students.length,
    totalSessions: sessions.length,
    totalMarks: logs.length,
  };
}
