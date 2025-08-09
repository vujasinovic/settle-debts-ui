import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Expense, Id } from "@/types";

interface NewExpenseModalProps {
  gid: string;
  members: Id[];
}

export const NewExpenseModal = ({ gid, members }: NewExpenseModalProps) => {
  const [open, setOpen] = useState(false);
  const [eid, setEid] = useState("");
  const [payer, setPayer] = useState<string>(members[0]?.value ?? "");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(members.map(m => m.value));
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("EUR");
  const [note, setNote] = useState<string>("");

  const qc = useQueryClient();

  const toggleParticipant = (id: string) => {
    setSelectedParticipants((prev) => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (!eid.trim()) throw new Error("Expense ID required");
      const amt = Number(amount);
      if (!Number.isFinite(amt) || amt <= 0) throw new Error("Amount must be > 0");
      if (!payer) throw new Error("Select payer");
      if (selectedParticipants.length === 0) throw new Error("Select at least one participant");

      const payload: Expense = {
        id: { value: eid.trim() },
        groupId: { value: gid }, // server overrides
        payer: { value: payer },
        amount: amt,
        currency,
        participants: selectedParticipants.map((value) => ({ value })),
        createdAt: new Date().toISOString(),
        note: note.trim() || undefined,
      };

      return api.createExpense(gid, payload);
    },
    onSuccess: async () => {
      toast({ title: "Expense added" });
      await qc.invalidateQueries({ queryKey: ["expenses", gid] });
      setOpen(false);
      setEid("");
      setPayer(members[0]?.value ?? "");
      setSelectedParticipants(members.map(m => m.value));
      setAmount("");
      setCurrency("EUR");
      setNote("");
    },
    onError: (err: any) => toast({ title: "Failed to add expense", description: String(err?.message ?? err), variant: "destructive" as any }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add expense</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Expense</DialogTitle>
          <DialogDescription>Add a shared expense to this group.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="eid">Expense ID</Label>
            <Input id="eid" placeholder="e9" value={eid} onChange={(e) => setEid(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Payer</Label>
            <Select value={payer} onValueChange={setPayer}>
              <SelectTrigger>
                <SelectValue placeholder="Select payer" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Participants</Label>
            <div className="grid grid-cols-2 gap-3">
              {members.map((m) => (
                <label key={m.value} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedParticipants.includes(m.value)}
                    onCheckedChange={() => toggleParticipant(m.value)}
                  />
                  {m.value}
                </label>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Input id="note" placeholder="lunch" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isPending} onClick={() => mutateAsync()}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewExpenseModal;
