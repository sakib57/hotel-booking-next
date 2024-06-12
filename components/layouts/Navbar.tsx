"use client";
import Container from "../Container";
import { UserButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import SearchInput from "../SearchInput";
import { ModeToggle } from "../ModeToggle";
import { NavMenu } from "./NavMenu";

const Navbar = () => {
  const router = useRouter();
  const { userId } = useAuth();
  return (
    <nav className="sticky top-0 border border-b-primary/10 bg-secondary">
      <Container>
        <div className="flex justify-between">
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image src="/hotel.svg" alt="Logo" height={30} width={30} />
            <h2 className="text-md font-medium hidden md:block">Hotel Booking</h2>
          </div>
          <SearchInput/>
          <div className="flex gap-3 items-center">
            <div><ModeToggle/></div>
            <div><NavMenu/></div>
            <UserButton afterSignOutUrl="/" />
            {!userId && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push("/sign-in")}
                >
                  Sign In
                </Button>
                <Button size="sm" onClick={() => router.push("/sign-up")}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
