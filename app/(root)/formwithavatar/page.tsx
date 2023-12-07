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
import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeSchema } from "@/lib/validation";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import router from "next/router";
import { createformWithAvatar } from "@/lib/action";
import supabase from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

const Page = () => {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const SUPABASE_FILE_DIRECTORY = "/storage/v1/object/public";
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState("");
  const [ImageURL, setImageURL] = useState("");
  const form = useForm<z.infer<typeof EmployeeSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      avatar_url: "",
    },
  });

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileName(file.name);
    console.log(file);
  };

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
    console.log(displayUrl);

    return { files, displayUrl };
  }

  async function handleUpload() {
    if (!selectedFile) {
      alert("Please select a file before uploading");
      return;
    }

    setUploading(true);

    try {
      // Extract file extension (e.g., 'jpg', 'png') from the original file name
      const fileExtension = fileName.split(".").pop();

      // Generate a random UUID and use it as the prefix for the file name
      const randomFileName = `${uuidv4()}.${fileExtension}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`public/${randomFileName}`, selectedFile);

      if (error) {
        throw error;
      }

      console.log("File upload successfully:", data);

      setImageURL(
        `${SUPABASE_URL}${SUPABASE_FILE_DIRECTORY}/avatars/public/${randomFileName}`
      );

      return {
        supabase_avatar_url: `${SUPABASE_URL}${SUPABASE_FILE_DIRECTORY}/avatars/public/${randomFileName}`,
      };
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof EmployeeSchema>) {
    setIsSubmitting(true);
    console.log(values);

    try {
      const result = await handleUpload();

      await createformWithAvatar({
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        avatar_url: result?.supabase_avatar_url as string,
      });
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Toaster />
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
            name="avatar_url"
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
                        handleFileChange(event);
                        setPreview(displayUrl);
                        // onChange(files);
                      }}
                    />
                  </FormControl>
                  <FormDescription>URL avatar: {preview}</FormDescription>
                  <FormDescription>URL supabase: {ImageURL}</FormDescription>
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
