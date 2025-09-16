import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Webcam } from "@/components/attendance/Webcam";
import { useAttendance } from "@/store/attendance";

export default function Register() {
  const { addStudent, captureFaceForStudent, students } = useAttendance();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [selectedId, setSelectedId] = useState<string>("");

  const onSave = () => {
    if (!id || !name || !course) return;
    addStudent({ id, name, course });
    setSelectedId(id);
  };

  const onCapture = (data: string) => {
    const sid = selectedId || id;
    if (!sid) return;
    captureFaceForStudent(sid, data);
  };

  return (
    <div className="container py-10">
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Register a Student</CardTitle>
            <CardDescription>One-time face capture linked to student details.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="id">Student ID</Label>
                <Input id="id" placeholder="STU-1004" value={id} onChange={(e) => setId(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="course">Course</Label>
                <Input id="course" placeholder="CS101" value={course} onChange={(e) => setCourse(e.target.value)} />
              </div>
              <div className="flex justify-end">
                <Button onClick={onSave}>Save Student</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Face Capture</CardTitle>
            <CardDescription>Capture 2-3 angles per student for better matching.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Webcam onCapture={onCapture} />
            <div className="text-sm text-muted-foreground">Selected: {selectedId || id || "None"}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Registered Students</CardTitle>
          <CardDescription>Click a student to continue capturing faces.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {students.map((s) => (
              <button key={s.id} onClick={() => setSelectedId(s.id)} className="rounded-md border p-4 text-left hover:bg-muted">
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.id} • {s.course}</div>
                <div className="mt-2 flex -space-x-2">
                  {s.faceImages.slice(-3).map((img, i) => (
                    <img key={i} src={img} className="h-8 w-8 rounded-full border object-cover" />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
