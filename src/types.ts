export interface Id {
    value: string;
}

export interface Group {
    id: Id;
    name: string;
    members: Id[];
}

export interface Expense {
    id: Id;
    groupId: Id;
    payer: Id;
    amount: number;
    currency: string;
    participants: Id[];
    createdAt: string; // ISO string
    note?: string;
}

export interface Settlement {
    from: Id;
    to: Id;
    amount: number;
    currency: string;
}

export const queryKeys = {
    groups: ["groups"] as const,
    expenses: (gid: string) => ["expenses", gid] as const,
    settlements: (gid: string) => ["settlements", gid] as const,
};
