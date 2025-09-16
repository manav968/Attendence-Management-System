import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Webcam } from "@/components/attendance/Webcam";
import { useAttendance, useStats } from "@/store/attendance";
import { ShieldCheck, Bell, Gauge, ScanFace, FileSpreadsheet, LineChart, Shield, Users } from "lucide-react";

const heroStats = [
  { label: "Students", key: "totalStudents" },
  { label: "Sessions", key: "totalSessions" },
  { label: "Marks", key: "totalMarks" },
] as const;

export default function Index() {
  const { byCourse, totalStudents, totalSessions, totalMarks } = useStats();
  const chartData = Object.entries(byCourse).map(([course, v]) => ({ course, rate: v.total ? Math.round((v.present / v.total) * 100) : 0 }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background">
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_0%,hsl(var(--primary)/0.25)_0%,transparent_70%)]" />
        <div className="container py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Badge className="mb-4" variant="secondary">Smart, Privacy-first</Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Smart Attendance with Face Recognition
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Replace manual roll-calls with secure, liveness-aware face recognition. Built for colleges and classrooms.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Button asChild size="lg"><Link to="/live">Start Live Session</Link></Button>
              <Button asChild variant="outline" size="lg"><Link to="/register">Register Faces</Link></Button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {heroStats.map((s) => (
                <Card key={s.key}>
                  <CardHeader className="py-3">
                    <CardDescription>{s.label}</CardDescription>
                    <CardTitle className="text-3xl">{s.key === "totalStudents" ? totalStudents : s.key === "totalSessions" ? totalSessions : totalMarks}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>Camera stream with basic capture. Add liveness and recognition on the backend.</CardDescription>
              </CardHeader>
              <CardContent>
                <Webcam autoStart onCapture={() => {}} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Feature icon={ScanFace} title="Face Registration" desc="One-time capture per student, store embeddings alongside ID and course." />
          <Feature icon={ShieldCheck} title="Liveness & Security" desc="Blink/head-move prompts and spoof prevention for real attendance." />
          <Feature icon={Users} title="Role-based Access" desc="Students, faculty, and admins get the right level of access." />
          <Feature icon={Gauge} title="Real-time Detection" desc="Low-latency video processing with modern web APIs." />
          <Feature icon={FileSpreadsheet} title="Attendance Logging" desc="Timestamped entries, session-aware, export to CSV." />
          <Feature icon={LineChart} title="Analytics Dashboard" desc="Visualize rates by course, date, or student with charts." />
        </div>
      </section>

      <section className="container pb-16">
        <Card>
          <CardHeader>
            <CardTitle>Attendance by Course</CardTitle>
            <CardDescription>Instant overview of present rate per course.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ rate: { label: "Present %", color: "hsl(var(--primary))" } }}
              className="w-full"
            >
              <AreaChart data={chartData} height={240}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="course" tickLine={false} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="rate" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center gap-3">
        <div className="h-10 w-10 rounded-md grid place-items-center bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
