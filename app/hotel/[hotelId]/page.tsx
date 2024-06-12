import { getHotelById } from "@/actions/getHotelById";
import AddHotelForm from "@/components/hotel/AddHotelForm";

interface HotelProps {
    params: {
        hotelId: string
    }
}

const Hotel = async ({params}: HotelProps) => {
    console.log('hotel id: ', params.hotelId)
    const hotel = await getHotelById(params.hotelId)
  return (
    <div>
      <AddHotelForm hotel={hotel} />
    </div>
  );
};

export default Hotel;
