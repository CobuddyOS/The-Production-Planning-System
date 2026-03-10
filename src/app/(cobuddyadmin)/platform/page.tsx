import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CobuddyAdminPlatformHomePage() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>ATLAS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Go to the ATLAS area of the Cobuddy Admin platform.
                    </p>
                    <Button asChild>
                        <Link href="/platform/atlas">Open ATLAS</Link>
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>ORB</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Go to the ORB area of the Cobuddy Admin platform.
                    </p>
                    <Button asChild variant="secondary">
                        <Link href="/platform/orb">Open ORB</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

