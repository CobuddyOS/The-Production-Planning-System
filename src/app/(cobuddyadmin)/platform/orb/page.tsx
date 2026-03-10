import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrbPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>ORB</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                Orb dashboard content goes here.
            </CardContent>
        </Card>
    );
}

