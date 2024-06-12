"use client";

import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Form";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/TextArea";
import { Checkbox } from "../ui/Checkbox";
import { Button } from "../ui/Button";
import { Loader2, Pencil, PencilLine, XCircle } from "lucide-react";
import { UploadButton } from "../utils/uploadthing";
import { toast } from "../ui/UseToast";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AddRoomFormProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room?: Room;
  handleDialogueOpen: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be atleast 3 character!",
  }),
  description: z.string().min(10, {
    message: "Title must be atleast 10 character!",
  }),
  bedCount: z.coerce.number().min(1, { message: "Bed count is required" }),
  guestCount: z.coerce.number().min(1, { message: "Guest count is required" }),
  bathroomCount: z.coerce
    .number()
    .min(1, { message: "Bathroom count is required" }),
  kingBed: z.coerce.number().min(0),
  queenBed: z.coerce.number().min(0),
  image: z.coerce.string().min(1, { message: "Image count is required" }),
  breakfstPrce: z.coerce.number().optional(),
  roomPrice: z.coerce
    .number()
    .min(1, { message: "Room price count is required" }),
  roomService: z.coerce.boolean().optional(),
  tv: z.coerce.boolean().optional(),
  balcony: z.coerce.boolean().optional(),
  freeWifi: z.coerce.boolean().optional(),
  cityView: z.coerce.boolean().optional(),
  oceanView: z.coerce.boolean().optional(),
  forestView: z.coerce.boolean().optional(),
  mountainView: z.coerce.boolean().optional(),
  airConduction: z.coerce.boolean().optional(),
  soundProofed: z.coerce.boolean().optional(),
});

export const AddRoomForm = ({
  hotel,
  room,
  handleDialogueOpen,
}: AddRoomFormProps) => {
  // States
  const [image, setImage] = useState<string | undefined>(room?.image);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isImageDeleting, setIsImageDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: room || {
      title: "",
      description: "",
      bedCount: 0,
      guestCount: 0,
      bathroomCount: 0,
      kingBed: 0,
      queenBed: 0,
      image: "",
      breakfstPrce: 0,
      roomPrice: 0,
      roomService: false,
      tv: false,
      balcony: false,
      freeWifi: false,
      cityView: false,
      oceanView: false,
      forestView: false,
      mountainView: false,
      airConduction: false,
      soundProofed: false,
    },
  });

  useEffect(() => {
    if (typeof image === "string") {
      form.setValue("image", image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
    // eslint-disable-next-line
  }, [image]);

  // Functions
  const handleImageDelete = (image: string) => {
    setIsImageDeleting(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);
    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.data.success) {
          setImage("");
          toast({
            variant: "success",
            description: "Image Removed",
          });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          description: "Something went wrong",
        });
      })
      .finally(() => {
        setIsImageDeleting(false);
      });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("hotelId: ", hotel?.id);
    console.log("roomId: ", room?.id);
    if (hotel && room) {
      axios
        .patch(`/api/room/${room.id}`, values)
        .then((res) => {
          toast({
            variant: "success",
            description: "Room updated",
          });
          router.refresh();
          setIsLoading(false);
          handleDialogueOpen();
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant: "destructive",
            description: "Something went wrong",
          });
          setIsLoading(false);
        });
    } else {
      if (!hotel) return;
      axios
        .post("/api/room", { ...values, hotelId: hotel.id })
        .then(() => {
          toast({
            variant: "success",
            description: "Room created",
          });
          router.refresh();
          setIsLoading(false);
          handleDialogueOpen();
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant: "destructive",
            description: "Something went wrong",
          });
          setIsLoading(false);
        });
    }
  }

  return (
    <div className="max-h-[75vh] overflow-y-auto px-2">
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Title</FormLabel>
                <FormDescription>Provide a room.</FormDescription>
                <FormControl>
                  <Input placeholder="Double Room" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Descrption</FormLabel>
                <FormDescription>
                  Is there anything special about this room?
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Have a beautiful ocean view"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormLabel>Choose Room Amenities</FormLabel>
            <FormDescription>
              What makes this room a good choice?
            </FormDescription>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <FormField
                control={form.control}
                name="roomService"
                render={({ field }) => (
                  <FormItem className="flex items-end space-x-2 rounded-md border p-3 pb-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>24 Hr Room Service</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balcony"
                render={({ field }) => (
                  <FormItem className="flex items-end space-x-2 rounded-md border p-3 pb-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Balcony</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tv"
                render={({ field }) => (
                  <FormItem className="flex items-end space-x-2 rounded-md border p-3 pb-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>TV</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freeWifi"
                render={({ field }) => (
                  <FormItem className="flex items-end space-x-2 rounded-md border p-3 pb-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Free WiFi</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cityView"
                render={({ field }) => (
                  <FormItem className="flex items-end space-x-2 rounded-md border p-3 pb-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>City View</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="forestView"
                render={({ field }) => (
                  <FormItem className="flex items-end space-x-2 rounded-md border p-3 pb-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Forest View</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="oceanView"
                render={({ field }) => (
                  <FormItem className="flex items-end space-x-2 rounded-md border p-3 pb-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Ocean View</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mountainView"
                render={({ field }) => (
                  <FormItem className="flex items-end space-x-2 rounded-md border p-3 pb-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Mountain View</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="airConduction"
                render={({ field }) => (
                  <FormItem className="flex items-end space-x-2 rounded-md border p-3 pb-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Air Condition</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soundProofed"
                render={({ field }) => (
                  <FormItem className="flex items-end space-x-2 rounded-md border p-3 pb-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Sound Proofed</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-3 mt-4">
                <FormLabel>Upload an Image *</FormLabel>
                <FormDescription>
                  Choose an image that will showcase your room
                </FormDescription>
                <FormControl>
                  {image ? (
                    <>
                      <div className="relative max-w-[600px] min-w-[200px] max-h-[450px] min-h-[150px]">
                        <Image
                          src={image}
                          alt="Hotel Image"
                          className="object-contain"
                          fill
                        />
                        <Button
                          onClick={() => handleImageDelete(image)}
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="absolute right-[-12px] top-0"
                        >
                          {isImageDeleting ? <Loader2 /> : <XCircle />}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col items-center max-w-[600px] p-12 border-2 border-dashed border-primary/50 rounded">
                        <UploadButton
                          endpoint="imageUploader"
                          onUploadBegin={() => setIsImageUploading(true)}
                          onClientUploadComplete={(res) => {
                            // Do something with the response
                            console.log("Files: ", res);
                            setImage(res[0].url);
                            // alert("Upload Completed");
                            toast({
                              variant: "success",
                              description: "Upload Completed",
                            });
                            setIsImageUploading(false);
                          }}
                          onUploadError={(error: Error) => {
                            // Do something with the error.
                            // alert(`ERROR! ${error.message}`);
                            toast({
                              variant: "destructive",
                              description: `ERROR! ${error.message}`,
                            });
                            setIsImageUploading(false);
                          }}
                        />
                      </div>
                    </>
                  )}
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-6">
            <div className="flex flex-col flex-1 gap-6">
              <FormField
                control={form.control}
                name="roomPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Price in USD</FormLabel>
                    <FormDescription>
                      State the price for staying in this for 24 hrs.
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bedCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Count</FormLabel>
                    <FormDescription>
                      How many beds in this room
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Count</FormLabel>
                    <FormDescription>
                      How many guests are allowed in this room
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={20} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathroomCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathroom Count</FormLabel>
                    <FormDescription>
                      How many bathrooms are in this room
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={16} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col flex-1 gap-6">
              <FormField
                control={form.control}
                name="breakfstPrce"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breakfast Price in USD</FormLabel>
                    <FormDescription>State the breakfast price</FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={300} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kingBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>King Bed</FormLabel>
                    <FormDescription>
                      How many king beds in this room
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="queenBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Queen Bed</FormLabel>
                    <FormDescription>
                      How many queen beds are in this room
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={16} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="pt-2 pb-2">
            {room ? (
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                className="max-w-[150px]"
                disabled={isLoading || isImageUploading || isImageDeleting}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4" />
                    Updating..
                  </>
                ) : (
                  <>
                    <PencilLine className="mr-2 h-4 w-4" />
                    Update
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                className="max-w-[150px]"
                disabled={isLoading || isImageUploading || isImageDeleting}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4" />
                    Creating
                  </>
                ) : (
                  <>
                    <Pencil className="mr-2 h-4 w-4" />
                    Create Room
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
