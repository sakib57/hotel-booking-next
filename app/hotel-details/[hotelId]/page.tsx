import { getHotelById } from '@/actions/getHotelById'
import { HotelWithRooms } from '@/components/hotel/AddHotelForm'
import HotelDetailsComponent from '@/components/hotel/HotelDetailsComponent'

interface HotelDetailsProps{
    params:{
        hotelId: string
    }
}

const HotelDetails = async ({params}: HotelDetailsProps) => {

    const hotel = await getHotelById(params.hotelId)
    if(!hotel) return <div>Hotel Not Found!</div>
  return (
    <HotelDetailsComponent hotel={hotel}/>
  )
}

export default HotelDetails