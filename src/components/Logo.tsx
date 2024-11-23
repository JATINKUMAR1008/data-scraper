import { cn } from "@/lib/utils";
import { SquareDashedMousePointerIcon } from "lucide-react";
import Link from "next/link";

export const Logo = ({
  fontSize = "text-2xl",
  iconSize = 20,
}: {
  fontSize?: string;
  iconSize?: number;
}) => {
  return <Link href="/" className={cn("text-2xl font-extrabold flex items-center gap-2",fontSize)}>
    <div className="rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 p-2 ">
        <SquareDashedMousePointerIcon size={iconSize} className="stroke-white"/>
    </div>
    <div>
        <span className="bg-gradient-to-r from-gray-500 to-gray-600 bg-clip-text text-transparent">
            Scraper
        </span>
    </div>
  </Link>;
};
