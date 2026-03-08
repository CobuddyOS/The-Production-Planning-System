import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeamPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Team</h2>
                <p className="text-muted-foreground">Manage your team members and roles.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Team Directory</CardTitle>
                    <CardDescription>A list of all team members.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border p-8 flex justify-center text-muted-foreground">
                        No team members found.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
