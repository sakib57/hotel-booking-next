import { Hotel, Room } from "@prisma/client";

export type RoomDataType = {
    room: Room;
    totalPrice: number;
    breakFastIncluded: boolean;
    startDate: Date;
    endDate: Date
}

export type HotelWithRooms = Hotel & {
    rooms: Room[];
  };