import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type TooltipComponentProps = {
  children: React.ReactNode;
  label: string;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  delayDuration?: number;
};

export default function TooltipComponent({ children, label, side, className, delayDuration }: TooltipComponentProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration || 300}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={cn("", className)} side={side || "top"}>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
