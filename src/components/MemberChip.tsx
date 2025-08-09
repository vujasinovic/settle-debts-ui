import { Badge } from "@/components/ui/badge";
import { Id } from "@/types";

interface MemberChipProps {
  id: Id | string;
}

export const MemberChip = ({ id }: MemberChipProps) => {
  const value = typeof id === "string" ? id : id.value;
  return (
    <Badge variant="secondary" className="rounded-full">
      {value}
    </Badge>
  );
};

export default MemberChip;
