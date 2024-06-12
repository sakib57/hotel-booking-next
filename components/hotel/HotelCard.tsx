"use client";
import { HotelWithRooms } from "./AddHotelForm";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { MapPin } from "lucide-react";
import useLocation from "@/hooks/useLocation";
import { Button } from "../ui/Button";

const HotelCard = ({ hotel }: { hotel: HotelWithRooms }) => {
  const pathName = usePathname();
  const isMyHotels = pathName.includes("my-hotels");
  const router = useRouter();
  const { getCountryByCode } = useLocation();
  const country = getCountryByCode(hotel.country);
  return (
    <div
      onClick={() => !isMyHotels && router.push(`/hotel-details/${hotel.id}`)}
      className={cn(
        "col-span-1 cursor:pointer transition hover:scale-105",
        isMyHotels && "cursor-default"
      )}
    >
      <div className="flex gap-2 bg-background/50 border border-primary/10 rounded-lg">
        <div className="aspect-square overflow-hidden flex-1 relative w-full h-[210px] rounded-s-lg">
          <Image
            src={hotel.image}
            alt={hotel.title}
            fill
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between h-[210px] gap-1 p-1 py-2 text-sm">
          <h3 className="font-semibold text-xl">{hotel.title}</h3>
          <p className="text-primary/90 ">
            {hotel.description.substring(0, 45)}
          </p>
          <div className="text-primary/90">
            <AmenityItem>
              <MapPin className="size-4" />
              {hotel.city}, {country?.name}
            </AmenityItem>
            {hotel.swimmingPool && (
              <AmenityItem>{hotel.swimmingPool}</AmenityItem>
            )}
            {hotel.gym && <AmenityItem>{hotel.gym}</AmenityItem>}
          </div>
          <div className="flex items-center justify-between">
            {hotel?.rooms[0]?.roomPrice && (
              <p className="font-semibold text-base">
                ${hotel?.rooms[0]?.roomPrice}
                <span className="text-xs"> / 24hrs</span>
              </p>
            )}
            {isMyHotels && (
              <Button
                onClick={() => router.push(`/hotel/${hotel.id}`)}
                variant="outline"
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
