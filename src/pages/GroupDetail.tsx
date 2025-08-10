import {useEffect, useMemo} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/api";
import {Group} from "@/types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import MemberChip from "@/components/MemberChip";
import ExpenseTable from "@/components/ExpenseTable";
import NewExpenseModal from "@/components/NewExpenseModal";
import {Skeleton} from "@/components/ui/skeleton";

const GroupDetail = () => {
    const {gid} = useParams<{ gid: string }>();
    const [sp, setSp] = useSearchParams();
    const tab = sp.get("tab") || "expenses";

    useEffect(() => {
        document.title = `Settle Debts – ${gid ?? "Group"}`;
    }, [gid]);

    const groupsQuery = useQuery({queryKey: ["groups"], queryFn: api.getGroups});

    const group: Group | undefined = useMemo(() => groupsQuery.data?.find((g) => g.id.value === gid), [groupsQuery.data, gid]);

    const expensesQuery = useQuery({
        queryKey: ["expenses", gid!],
        queryFn: () => api.getExpenses(gid!),
        enabled: !!gid,
    });

    const settlementsQuery = useQuery({
        queryKey: ["settlements", gid!],
        queryFn: () => api.getSettlements(gid!),
        enabled: !!gid,
    });

    if (groupsQuery.isLoading) {
        return (
            <main className="container max-w-4xl mx-auto py-10">
                <Skeleton className="h-10 w-64 mb-6"/>
                <Skeleton className="h-32 w-full"/>
            </main>
        );
    }

    if (!group) {
        return (
            <main className="container max-w-4xl mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Group not found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <a className="text-primary underline" href="/">Back to groups</a>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="container max-w-4xl mx-auto py-10">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold">{group.name}</h1>
                <div className="mt-3 flex flex-wrap gap-2">
                    {group.members.map((m) => (
                        <MemberChip key={m.value} id={m}/>
                    ))}
                </div>
            </header>

            <Card className="rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <CardTitle>Group Details</CardTitle>
                    <NewExpenseModal gid={group.id.value} members={group.members}/>
                </CardHeader>
                <CardContent>
                    <Tabs value={tab} onValueChange={(v) => setSp((prev) => {
                        prev.set("tab", v);
                        return prev;
                    })}>
                        <TabsList>
                            <TabsTrigger value="expenses">Expenses</TabsTrigger>
                            <TabsTrigger value="settlements">Settlements</TabsTrigger>
                        </TabsList>
                        <TabsContent value="expenses" className="mt-4">
                            {expensesQuery.isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-full"/>
                                    <Skeleton className="h-8 w-full"/>
                                    <Skeleton className="h-8 w-full"/>
                                </div>
                            ) : expensesQuery.data ? (
                                <ExpenseTable expenses={expensesQuery.data}/>
                            ) : (
                                <div className="text-sm text-muted-foreground">Failed to load expenses</div>
                            )}
                        </TabsContent>
                        <TabsContent value="settlements" className="mt-4">
                            {settlementsQuery.isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-64"/>
                                    <Skeleton className="h-6 w-64"/>
                                    <Skeleton className="h-6 w-64"/>
                                </div>
                            ) : settlementsQuery.data && settlementsQuery.data.length ? (
                                <ul className="space-y-2">
                                    {settlementsQuery.data.map((s, idx) => (
                                        <li key={idx} className="text-sm">
                                            <span className="font-medium">{s.from}</span>
                                            <span className="mx-2">→</span>
                                            <span className="font-medium">{s.to}</span>
                                            <span className="mx-2">:</span>
                                            <span
                                                className="text-muted-foreground">{s.amount.toFixed(2)} {s.currency}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-sm text-muted-foreground">No settlements needed.</div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </main>
    );
};

export default GroupDetail;
