import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useAttendance } from "@/store/attendance";

export default function Dashboard() {
  const { logs, sessions, students } = useAttendance();

  const byCourse = useMemo(() => {
    const map = new Map<string, { present: number; total: number }>();
    for (const s of sessions) {
      const roster = students.filter((st) => st.course === s.course).length;
      const curr = map.get(s.course) || { present: 0, total: 0 };
      curr.total += roster;
      map.set(s.course, curr);
    }
    for (const l of logs) {
      const sess = sessions.find((s) => s.id === l.sessionId);
      if (!sess) continue;
      const curr = map.get(sess.course) || { present: 0, total: 0 };
      curr.present += 1;
      map.set(sess.course, curr);
    }
    return Array.from(map.entries()).map(([course, v]) => ({ course, rate: v.total ? Math.round((v.present / v.total) * 100) : 0 }));
  }, [logs, sessions, students]);

  const latest = useMemo(() => logs.slice(-10).reverse(), [logs]);

  return (
    <div className="container py-10 space-y-8">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Present Rate by Course</CardTitle>
            <CardDescription>Higher is better. Aim for 95%+.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ rate: { label: "Present %", color: "hsl(var(--primary))" } }}>
              <BarChart data={byCourse} height={260}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="course" tickLine={false} axisLine={false} />
                <YAxis hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="rate" fill="hsl(var(--primary))" radius={6} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Last 10 attendance marks.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latest.map((l) => {
                  const st = students.find((s) => s.id === l.studentId);
                  const sess = sessions.find((s) => s.id === l.sessionId);
                  return (
                    <TableRow key={l.id}>
                      <TableCell>{st?.name ?? l.studentId}</TableCell>
                      <TableCell>{st?.course ?? sess?.course}</TableCell>
                      <TableCell>{l.method}</TableCell>
                      <TableCell className="text-right">{new Date(l.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
