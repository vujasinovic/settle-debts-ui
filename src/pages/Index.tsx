import {useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/api";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import GroupCard from "@/components/GroupCard";
import NewGroupModal from "@/components/NewGroupModal";

const Index = () => {
    useEffect(() => {
        document.title = "Settle Debts – Groups";
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute("content", "Browse groups and manage shared expenses.");
    }, []);

    const groupsQuery = useQuery({queryKey: ["groups"], queryFn: api.getGroups});

    return (
        <main className="container max-w-4xl mx-auto py-10">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Groups</h1>
                <NewGroupModal/>
            </header>

            {groupsQuery.isLoading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full"/>
                    ))}
                </div>
            ) : groupsQuery.data && groupsQuery.data.length ? (
                <div className="grid sm:grid-cols-2 gap-4">
                    {groupsQuery.data.map((g) => (
                        <GroupCard key={g.id.value} group={g}/>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>No groups yet</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Create your first group to start tracking expenses.
                    </CardContent>
                </Card>
            )}
        </main>
    );
};

export default Index;
