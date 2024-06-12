"use client"

import { Booking } from "@prisma/client";
import { HotelWithRooms } from "./AddHotelForm";
import useLocation from "@/hooks/useLocation";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { MapPin } from "lucide-react";
import { FaSwimmer } from "react-icons/fa";
import { MdLocalBar } from "react-icons/md";
import { FiCoffee } from "react-icons/fi";
import { FaDumbbell } from "react-icons/fa6";
import { MdDryCleaning } from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { IoRestaurant } from "react-icons/io5";
import { FaSpa } from "react-icons/fa";
import { BiSolidMoviePlay } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";
import HotelCard from "./HotelCard";
import RoomCard from "../room/RoomCard";

const HotelDetailsComponent = ({
  hotel,
  bookings,
}: {
  hotel: HotelWithRooms;
  bookings?: Booking[];
}) => {
  const { getCountryByCode, getStateByCode } = useLocation();
  const country = getCountryByCode(hotel.country);
  const state = getStateByCode(hotel.country, hotel.state);
  return (
    <div className="flex flex-col gap-6 pb-2">
      <div className="aspect-square overflow-hidden relative w-full h-[200px] md:h-[400px] rounded-lg">
        <Image
          src={hotel.image}
          alt={hotel.title}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <h3 className="font-semibold text-lg md:text-3xl">{hotel.title}</h3>
        <div className="font-semibold mt-4">
          <AmenityItem>
            <MapPin className="size-4" />
            {hotel?.city}, {state?.name}, {country?.name}
          </AmenityItem>
        </div>
        <h3 className="font-semibold text-lg mt-4 mb-2">Location Details</h3>
        <p className="text-primary/90 mb-2">{hotel?.location}</p>
        <h3 className="font-semibold text-lg mt-4 mb-2">About this hotel</h3>
        <p className="text-primary/90 mb-2">{hotel?.description}</p>
        <h3 className="font-semibold text-lg mt-4 mb-2">Popular Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 content-start text-sm">
          {hotel.swimmingPool && (
            <AmenityItem>
              <FaSwimmer size={20} />
              Pool
            </AmenityItem>
          )}
          {hotel.bar && (
            <AmenityItem>
              <MdLocalBar size={20} />
              Bar
            </AmenityItem>
          )}
          {hotel.coffeeShop && (
            <AmenityItem>
              <FiCoffee size={20} />
              Coffee Shop
            </AmenityItem>
          )}
          {hotel.gym && (
            <AmenityItem>
              <FaDumbbell size={20} />
              Gym
            </AmenityItem>
          )}
          {hotel.freeParking && (
            <AmenityItem>
              <FaCar size={20} />
              Parking
            </AmenityItem>
          )}
          {hotel.freeWifi && (
            <AmenityItem>
              <FaWifi size={20} />
              WiFi
            </AmenityItem>
          )}
          {hotel.laundry && (
            <AmenityItem>
              <MdDryCleaning size={20} />
              Laundry
            </AmenityItem>
          )}
          {hotel.shopping && (
            <AmenityItem>
              <FaShoppingCart size={20} />
              Shopping
            </AmenityItem>
          )}
          {hotel.movieNights && (
            <AmenityItem>
              <BiSolidMoviePlay size={20} />
              Movie Nights
            </AmenityItem>
          )}
          {hotel.spa && (
            <AmenityItem>
              <FaSpa size={20} />
              Spa
            </AmenityItem>
          )}
          {hotel.restaurant && (
            <AmenityItem>
              <IoRestaurant size={20} />
              Restaurant
            </AmenityItem>
          )}
        </div>
      </div>
      <div>
        {!!hotel.rooms && <div>
            <h3 className="text-lg font-semibold my-4">Hotel Rooms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {hotel.rooms.map((room)=> <RoomCard key={room.id} hotel={hotel} room={room} bookings={bookings}  />)}
            </div>
            </div>}
      </div>
    </div>
  );
};

export default HotelDetailsComponent;
