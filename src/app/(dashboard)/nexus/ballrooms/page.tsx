import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BallroomsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Ballrooms</h2>
                <p className="text-muted-foreground">Manage ballroom bookings and availability.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Ballroom Status</CardTitle>
                    <CardDescription>Current status of all ballrooms.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-md border p-4 space-y-2">
                                <div className="font-semibold">Ballroom {i}</div>
                                <div className="text-sm text-green-600">Available</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
