"use client";

import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeSchema } from "@/lib/validation";
import { z } from "zod";

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  // FileList is immutable, so we need to create a new one
  const dataTransfer = new DataTransfer();

  // Add newly uploaded images
  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image)
  );

  const files = dataTransfer.files;
  // console.log(files);
  const displayUrl = URL.createObjectURL(event.target.files![0]);

  return { files, displayUrl };
}

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState("");
  const form = useForm<z.infer<typeof EmployeeSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      avatar: "",
    },
  });

  function onSubmit(values: z.infer<typeof EmployeeSchema>) {
    console.log({ values });
  }

  return (
    <>
      <Form {...form}>
        <form
          className="space-y-8 mt-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="mt-8">
                  Email <span className="">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    className="no-focus paragraph-regular min-h-[42px] border"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="">
                  First Name <span className="">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    className="no-focus paragraph-regular min-h-[42px] border"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="">
                  Last Name <span className="">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    className="no-focus paragraph-regular min-h-[42px] border"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />{" "}
          <Avatar className="w-24 h-24">
            <AvatarImage src={preview} />
            <AvatarFallback>AZ</AvatarFallback>
          </Avatar>
          <FormField
            control={form.control}
            name="avatar"
            render={({ field: { onChange, value, ...rest } }) => (
              <>
                <FormItem>
                  <FormLabel>Upload your avatar</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      {...rest}
                      onChange={(event) => {
                        const { files, displayUrl } = getImageData(event);
                        setPreview(displayUrl);
                        onChange(files);
                      }}
                    />
                  </FormControl>
                  <FormDescription>This is a description...</FormDescription>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={() => toast.success(`New employee has been created`)}
          >
            {isSubmitting ? <div>Submitting...</div> : <div>Submit</div>}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default Page;
