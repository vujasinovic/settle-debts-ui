import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Group } from "@/types";
import { useNavigate } from "react-router-dom";

interface GroupCardProps {
  group: Group;
}

export const GroupCard = ({ group }: GroupCardProps) => {
  const navigate = useNavigate();
  const membersCount = group.members?.length ?? 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4">
          <span>{group.name}</span>
          <span className="text-sm text-muted-foreground">{group.id.value}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Members: {membersCount}</div>
        <Button onClick={() => navigate(`/groups/${group.id.value}`)}>Open</Button>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
