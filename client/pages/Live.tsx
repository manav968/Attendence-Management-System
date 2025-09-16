import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Webcam } from "@/components/attendance/Webcam";
import { useAttendance } from "@/store/attendance";

export default function Live() {
  const { students, addSession, sessions, markAttendance } = useAttendance();
  const today = new Date().toISOString().slice(0, 10);
  const [course, setCourse] = useState(students[0]?.course || "CS101");
  const [label, setLabel] = useState("Morning");

  const sessionId = useMemo(() => addSession({ name: label, course, date: today }), [course, label, today]);

  const roster = students.filter((s) => s.course === course);

  const handleMark = (studentId: string) => {
    markAttendance({ studentId, sessionId, method: "manual", livenessPassed: true });
  };

  return (
    <div className="container py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Live Session</CardTitle>
          <CardDescription>Start a session and watch attendance update in real time.</CardDescription>
        </CardHeader>
        <CardContent className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Course</Label>
                <Select value={course} onValueChange={setCourse}>
                  <SelectTrigger><SelectValue placeholder="Course" /></SelectTrigger>
                  <SelectContent>
                    {[...new Set(students.map((s) => s.course))].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Label</Label>
                <Input value={label} onChange={(e) => setLabel(e.target.value)} />
              </div>
            </div>
            <Webcam onCapture={() => {}} />
            <div className="text-xs text-muted-foreground">Session ID: {sessionId}</div>
          </div>

          <div>
            <div className="mb-2 text-sm text-muted-foreground">Roster • Click to mark present</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {roster.map((s) => (
                <button key={s.id} onClick={() => handleMark(s.id)} className="rounded-md border p-3 text-left hover:bg-primary/5">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.id}</div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
