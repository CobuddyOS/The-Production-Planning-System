import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RequestsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Requests</h2>
                <p className="text-muted-foreground">View and manage all incoming requests.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Requests</CardTitle>
                    <CardDescription>All active and pending requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border p-8 flex justify-center text-muted-foreground">
                        No requests found.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
