"use-client";

import { Booking, Hotel, Room } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import {
  AirVent,
  Bath,
  Bed,
  BedDouble,
  Castle,
  Home,
  Loader2,
  MountainSnow,
  Pencil,
  PencilLine,
  Plus,
  Ship,
  Trash,
  Trees,
  Tv,
  Users,
  UtensilsCrossed,
  VolumeX,
  Wand2,
  Wifi,
} from "lucide-react";
import { Separator } from "../ui/Separator";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "../ui/Dialog";
import { AddRoomForm } from "./AddRoomForm";
import axios from "axios";
import { toast } from "../ui/UseToast";
import { DatePickerWithRange } from "./DateRangePicker";
import { DateRange } from "react-day-picker";
import { differenceInCalendarDays } from "date-fns";
import { Checkbox } from "../ui/Checkbox";
import { Label } from "../ui/Label";
import { useAuth } from "@clerk/nextjs";
import useBookRoom from "@/hooks/useBookRoom";

interface RoomCardProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room: Room;
  bookings?: Booking[];
}

const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
  // States
  const [modalOpen, setModalOpen] = useState(false);
  const [isgRoomDeleting, setIsRoomDeleting] = useState(false);
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [totalPrice, setTotalPrice] = useState(room.roomPrice);
  const [includeBreakfast, setIncludeBreakfast] = useState(false);
  const [days, setDays] = useState(1);
  //   hooks
  const { setBookingRoomData, paymentIntentId, setPaymentIntentId, setStripeClientSecret } = useBookRoom()
  const pathName = usePathname();
  const isHotelDetailsPage = pathName.includes("hotel-details");
  const router = useRouter();
  const {userId} = useAuth()

  // Efects
  useEffect(() => {
    if (date && date.from && date.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);
      setDays(dayCount);
      if (dayCount && room.roomPrice) {
        if (includeBreakfast && room.breakfstPrce) {
          setTotalPrice(
            dayCount * room.roomPrice + dayCount * room.breakfstPrce
          );
        } else {
          setTotalPrice(dayCount * room.roomPrice);
        }
      } else {
        setTotalPrice(room.roomPrice);
      }
    }

    // eslint-disable-next-line
  }, [date, room.roomPrice, includeBreakfast]);

  //   Functions
  const handleDialogueOpen = () => {
    setModalOpen((prev) => !prev);
  };

  const handleDeleteRoom = async (room: Room) => {
    setIsRoomDeleting(true);
    const getImageKey = (src: string) =>
      src.substring(src.lastIndexOf("/") + 1);

    try {
      const imageKey = getImageKey(room.image);
      await axios
        .post("/api/uploadthing/delete", { imageKey })
        .then(async () => {
          await axios.delete(`/api/room/${room.id}`).then(() => {
            toast({
              variant: "success",
              description: "Room Deleted!",
            });
            router.refresh();
          });
        });
    } catch (error) {
      console.log(error);

      toast({
        variant: "destructive",
        description: "Could not delete room",
      });
    } finally {
      setIsRoomDeleting(false);
    }
  };

  const handleBookRoom = () => {
    if(!userId) return toast({
      variant: "destructive",
      description: "Opps! Make sure you are logged in"
    })

    if(!hotel?.userId) return toast({
      variant: "destructive",
      description: "Opps! Something went wrong! Try later"
    })

    if(date?.from && date?.to){
      setBookingIsLoading(true)
      const bookingRoomData = {
        room,
        totalPrice,
        breakFastIncluded: includeBreakfast,
        startDate: date.from,
        endDate: date.to,
      }
      setBookingRoomData(bookingRoomData)

      fetch('/api/create-payment-intent',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          booking: {
            hotelOwnerId: hotel.userId,
            hotelId: hotel.id,
            roomId: room.id,
            startDate: date.from,
            endDate: date.to,
            breakFastIncluded: includeBreakfast,
            totalPrice: totalPrice
          },
          payment_intent_id: paymentIntentId
        })
      }).then((res)=>{
        setBookingIsLoading(false)
        if(res.status === 401){
          return router.push('/login')
        }
        return res.json()
      }).then((data)=>{
        setStripeClientSecret(data.paymentIntent.client_secret)
        setPaymentIntentId(data.paymentIntent.id)
        router.push('/book-room')
      }).catch((error)=>{
        console.log('Error: ', error)
        toast({
          variant: 'destructive',
          description: `Error: ${error.message}`
        })
      })

    }else{
      toast({
        variant: "destructive",
        description: "Opps! Select Date"
      })
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="overflow-hidden relative h-[150px] rounded-lg">
          <Image src={room.image} alt="Room image" fill className="obj-cover" />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          <AmenityItem>
            <Bed className="h-4 w-4" /> {room.bedCount} Bed
            {room.bedCount > 1 && "s"}
          </AmenityItem>
          <AmenityItem>
            <Users className="h-4 w-4" /> {room.guestCount} Guest
            {room.bedCount > 1 && "s"}
          </AmenityItem>
          <AmenityItem>
            <Bath className="h-4 w-4" /> {room.bathroomCount} Bath{" "}
            {room.bathroomCount > 1 && "s"}
          </AmenityItem>
          {!!room.kingBed && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {room.kingBed} King Bed {room.kingBed > 1 && "s"}
            </AmenityItem>
          )}
          {!!room.queenBed && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {room.queenBed} Queen Bed {room.queenBed > 1 && "s"}
            </AmenityItem>
          )}
          {room.roomService && (
            <AmenityItem>
              <UtensilsCrossed className="h-4 w-4" />
              Room Service
            </AmenityItem>
          )}
          {room.tv && (
            <AmenityItem>
              <Tv className="h-4 w-4" />
              TV
            </AmenityItem>
          )}
          {room.balcony && (
            <AmenityItem>
              <Home className="h-4 w-4" />
              Balcony
            </AmenityItem>
          )}
          {room.freeWifi && (
            <AmenityItem>
              <Wifi className="h-4 w-4" />
              Free Wifi
            </AmenityItem>
          )}
          {room.cityView && (
            <AmenityItem>
              <Castle className="h-4 w-4" />
              City View
            </AmenityItem>
          )}
          {room.oceanView && (
            <AmenityItem>
              <Ship className="h-4 w-4" />
              Ocean View
            </AmenityItem>
          )}
          {room.forestView && (
            <AmenityItem>
              <Trees className="h-4 w-4" />
              Forest View
            </AmenityItem>
          )}
          {room.mountainView && (
            <AmenityItem>
              <MountainSnow className="h-4 w-4" />
              Mountain View
            </AmenityItem>
          )}
          {room.airConduction && (
            <AmenityItem>
              <AirVent className="h-4 w-4" />
              Aircondition
            </AmenityItem>
          )}
          {room.soundProofed && (
            <AmenityItem>
              <VolumeX className="h-4 w-4" />
              Sound Proofed
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div className="flex gap-4 justify-between">
          <div>
            Room Price: <span className="font-bold">${room.roomPrice}</span>
            <span className="text-xs"> /24 hrs</span>
            {!!room.breakfstPrce && (
              <div>
                {" "}
                Breakfast Price:{" "}
                <span className="font-bold">${room.breakfstPrce}</span>
              </div>
            )}
          </div>
        </div>
        <Separator />
      </CardContent>

      <CardFooter>
        {isHotelDetailsPage ? (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-2 font-semibold text-lg">Select date</h3>
              <DatePickerWithRange date={date} setDate={setDate} />
            </div>
            {room.breakfstPrce > 0 && (
              <div>
                <div className="mb-2">
                  Do you want to be served breakfast every day?
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`breakfast-[${room.id}]`}
                    onCheckedChange={(value) => setIncludeBreakfast(!!value)}
                  />
                  <Label htmlFor={`breakfast-[${room.id}]`} className="text-sm">
                    Include Breakfast
                  </Label>
                </div>
              </div>
            )}
            <div>
              Total Price: <span className="font-bold">${totalPrice}</span> for{" "}
              <span className="font-bold">{days} Days</span>
            </div>
            
              <Button type="button" onClick={()=> handleBookRoom()} disabled={bookingIsLoading}>
                {bookingIsLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2" /> Booking...
                  </>
                ) : (
                  <><Wand2 className="size-4 mr-2" /> Book Room</>
                )}
              </Button>
            
          </div>
        ) : (
          <div className="w-full flex justify-between">
            <Button
              onClick={() => handleDeleteRoom(room)}
              disabled={isgRoomDeleting}
              type="button"
              variant="ghost"
            >
              {isgRoomDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="max-w-[150px]"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Room
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[900px] w-[90%]">
                <DialogHeader>
                  <DialogTitle>Update room</DialogTitle>
                  <DialogDescription>
                    Make changes to this room
                  </DialogDescription>
                </DialogHeader>
                <AddRoomForm
                  hotel={hotel}
                  room={room}
                  handleDialogueOpen={handleDialogueOpen}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
