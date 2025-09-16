import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAttendance } from "@/store/attendance";

export default function Reports() {
  const { sessions, exportLogsCSV, students } = useAttendance();
  const [sessionId, setSessionId] = useState<string | undefined>(sessions[0]?.id);
  const [course, setCourse] = useState<string | undefined>(students[0]?.course);

  const download = () => {
    const url = exportLogsCSV({ sessionId, course });
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${sessionId || "all"}.csv`;
    a.click();
  };

  const distinctCourses = useMemo(() => Array.from(new Set(students.map((s) => s.course))), [students]);

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Reports & Export</CardTitle>
          <CardDescription>Filter and export attendance logs as CSV.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 items-end">
          <div className="grid gap-2">
            <Label>Session</Label>
            <Select value={sessionId} onValueChange={setSessionId}>
              <SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger>
              <SelectContent>
                {sessions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.date} • {s.course} • {s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Course</Label>
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
              <SelectContent>
                {distinctCourses.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex md:justify-end">
            <Button onClick={download}>Export CSV</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
