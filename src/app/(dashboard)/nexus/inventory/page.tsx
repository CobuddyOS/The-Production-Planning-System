import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function InventoryPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
                <p className="text-muted-foreground">Track and manage supplies and equipment.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Current Inventory</CardTitle>
                    <CardDescription>All items currently in stock.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border p-8 flex justify-center text-muted-foreground">
                        No items in inventory.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
