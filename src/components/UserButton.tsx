import { getUser } from "@/lib/sessions";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CoinsIcon, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

const dropDownOptions = [
  {
    icon: User,
    label: "profile",
    href: "/profile",
  },
  {
    href: "billing",
    label: "Billing",
    icon: CoinsIcon,
  },
  {
    href: "settings",
    label: "Settings",
    icon: Settings,
  },
];

export async function UserButton() {
  const user = await getUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback className="uppercase">
            {(user?.firstName?.charAt(0) || "") +
              (user?.lastName?.charAt(0) || "")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {dropDownOptions.map((option, index) => (
            <DropdownMenuItem key={index}>
              <Link
                href={option.href}
                className="w-full flex items-center gap-2"
              >
                <option.icon size={20} />
                <span>{option.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/auth/logout" className="w-full flex items-center gap-2">
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
