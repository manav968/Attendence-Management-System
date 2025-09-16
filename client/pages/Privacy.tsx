import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Compliance</CardTitle>
          <CardDescription>How Amity Attendance handles sensitive data.</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none">
          <p>We believe attendance should be accurate and privacy-conscious. Face images and embeddings should be encrypted at rest and in transit. Data is collected with consent and can be deleted on request.</p>
          <ul>
            <li>Encryption of face data and logs</li>
            <li>Role-based access controls</li>
            <li>Opt-in registration and opt-out at any time</li>
            <li>Audit logs for access</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
