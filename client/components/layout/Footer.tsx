export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Amity Attendance. Privacy-first attendance.</p>
        <div className="flex items-center gap-4">
          <a className="hover:text-foreground" href="/reports">Reports</a>
          <a className="hover:text-foreground" href="/dashboard">Dashboard</a>
          <a className="hover:text-foreground" href="/privacy">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
