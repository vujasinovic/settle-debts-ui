import { Expense, Id } from "@/types";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import MemberChip from "@/components/MemberChip";
import Money from "@/components/Money";

interface ExpenseTableProps {
  expenses: Expense[];
}

const formatDate = (iso: string) => {
  try {
    return format(new Date(iso), "Pp");
  } catch {
    return iso;
  }
};

export const ExpenseTable = ({ expenses }: ExpenseTableProps) => {
  if (!expenses.length) {
    return (
      <div className="text-sm text-muted-foreground">No expenses yet. Add the first one!</div>
    );
  }

  return (
    <Table>
      <TableCaption>Group expenses</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Created at</TableHead>
          <TableHead>Payer</TableHead>
          <TableHead>Participants</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Note</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((e) => (
          <TableRow key={e.id.value} className="hover:bg-muted/50">
            <TableCell className="whitespace-nowrap">{formatDate(e.createdAt)}</TableCell>
            <TableCell><MemberChip id={e.payer as Id} /></TableCell>
            <TableCell className="flex flex-wrap gap-2">
              {e.participants.map((p) => (
                <MemberChip key={p.value} id={p} />
              ))}
            </TableCell>
            <TableCell className="text-right whitespace-nowrap"><Money amount={e.amount} currency={e.currency} /></TableCell>
            <TableCell className="max-w-[22ch] truncate" title={e.note}>{e.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExpenseTable;
