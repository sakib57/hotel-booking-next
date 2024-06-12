"use client";

import * as React from "react";
import { BookOpenCheck, Hotel, Menu, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";

export function NavMenu() {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" size="icon">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex gap-1 cursor-pointer items-center" onClick={() => router.push("/hotel/new")}>
          <Plus size={15} /> <span>Add Hotel</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-1 cursor-pointer items-center" onClick={() => router.push("/my-hotels")}>
          <Hotel size={15} />
          <span>My Hotel</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-1 cursor-pointer items-center" onClick={() => router.push("/my-bookings")}>
          <BookOpenCheck size={15} /> <span>My Bookings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
