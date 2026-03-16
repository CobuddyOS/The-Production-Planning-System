import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-6 font-montserrat">
            <div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight font-orbitron">SETTINGS HUB</h2>
                <p className="text-sm text-muted-foreground font-orbitron">Manage your nexus dashboard preferences.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input defaultValue="Admin" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input defaultValue="admin@example.com" />
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>
        </div>
    );
}
