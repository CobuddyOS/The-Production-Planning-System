import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AtlasPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>ATLAS</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                Atlas dashboard content goes here.
            </CardContent>
        </Card>
    );
}

