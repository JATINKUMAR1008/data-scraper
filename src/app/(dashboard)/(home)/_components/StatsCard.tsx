import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;
}
export const StatsCard = (props: Props) => {
  return (
    <Card className="overflow-hidden relative h-full">
      <CardHeader className="flex pb-2">
        <CardTitle>
          {props.title}
          <props.icon
            size={120}
            className="text-muted-foreground absolute -bottom-4 -right-8 stroke-primary opacity-10"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          <ReactCountUpWrapper value={props.value} />
        </div>
      </CardContent>
    </Card>
  );
};
