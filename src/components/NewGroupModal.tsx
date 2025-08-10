import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {api} from "@/lib/api";
import {Group} from "@/types";
import {toast} from "@/hooks/use-toast";

export const NewGroupModal = () => {
    const [open, setOpen] = useState(false);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [members, setMembers] = useState("");

    const qc = useQueryClient();
    const {mutateAsync, isPending} = useMutation({
        mutationFn: async () => {
            const membersArray = members
                .split(",")
                .map((m) => m.trim())
                .filter(Boolean)
                .map((value) => ({value}));

            if (!id.trim() || !name.trim()) throw new Error("Group ID and Name are required");
            if (membersArray.length < 1) throw new Error("At least one member required");

            const payload: Group = {
                id: {value: id.trim()},
                name: name.trim(),
                members: membersArray,
            };
            return api.createGroup(payload);
        },
        onSuccess: async () => {
            toast({title: "Group created"});
            await qc.invalidateQueries({queryKey: ["groups"]});
            setOpen(false);
            setId("");
            setName("");
            setMembers("");
        },
        onError: (err: any) => toast({
            title: "Failed to create group",
            description: String(err?.message ?? err),
            variant: "destructive" as any
        }),
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>+ New group</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Group</DialogTitle>
                    <DialogDescription>Create a group to track shared expenses.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="gid">Group ID</Label>
                        <Input id="gid" placeholder="g9" value={id} onChange={(e) => setId(e.target.value)}/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="gname">Name</Label>
                        <Input id="gname" placeholder="Trip to Rome" value={name}
                               onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="members">Members (comma-separated user IDs)</Label>
                        <Input id="members" placeholder="u1,u2,u3" value={members}
                               onChange={(e) => setMembers(e.target.value)}/>
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={isPending} onClick={async () => {
                        try {
                            await mutateAsync();
                        } catch {
                        }
                    }}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewGroupModal;
