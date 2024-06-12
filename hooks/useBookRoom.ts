import { RoomDataType } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookRoomStore {
  bookingRoomData: RoomDataType | null;
  paymentIntentId: string | null;
  stripeClientSecret: string | undefined;
  setBookingRoomData: (data: RoomDataType) => void;
  setPaymentIntentId: (paymentIntentId: string) => void;
  setStripeClientSecret: (stripeClientSecret: string) => void;
  resetBookRoom: () => void;
}

const useBookRoom = create<BookRoomStore>()(
  persist(
    (set) => ({
      bookingRoomData: null,
      paymentIntentId: null,
      stripeClientSecret: undefined,
      setBookingRoomData: (bookingRoomData: RoomDataType) => {
        set({ bookingRoomData });
      },
      setPaymentIntentId: (paymentIntentId: string) => {
        set({ paymentIntentId });
      },
      setStripeClientSecret: (stripeClientSecret: string) => {
        set({ stripeClientSecret });
      },
      resetBookRoom: () => {
        set({
          bookingRoomData: null,
          paymentIntentId: null,
          stripeClientSecret: undefined,
        });
      },
    }),
    { name: "BookRoom" }
  )
);

export default useBookRoom;
