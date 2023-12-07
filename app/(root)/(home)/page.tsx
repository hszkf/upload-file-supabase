"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

import { ChangeEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { createImageMetadata } from "@/lib/action";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import supabase from "@/lib/supabase";

export default function Home() {
  // const user_id = "1234";
  const user_id = uuidv4() as string;
  // const user_id = "9ec382ba-22ac-4d1d-8c86-b5d631c67ae5";
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  // const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const SUPABASE_FILE_DIRECTORY = "/storage/v1/object/public";
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [ImageURL, setImageURL] = useState("");
  // const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const path = usePathname();

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileName(file.name);

    console.log(file);
  };

  const handleUpload = async () => {
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

      try {
        await createImageMetadata({
          user_id: user_id,
          image_url: `${SUPABASE_URL}${SUPABASE_FILE_DIRECTORY}/avatars/public/${randomFileName}`,
          path: path,
        });

        toast.success("Image has been stored to the database");
      } catch (error) {
        console.log(error);
        throw error;
      }

      console.log(ImageURL);
    } catch (error) {
      console.log("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col gap-10 max-w-2xl mx-auto px-10 h-[42rem]">
      <Toaster position="top-center" />

      {selectedFile ? (
        <div className="relative w-full mb-4 flex justify-center items-center flex-col gap-2">
          {selectedFile && (
            <Image
              src={URL.createObjectURL(selectedFile)}
              alt="Uploaded Image"
              width={140}
              height={140}
              className="rounded-lg"
            />
          )}

          {ImageURL && (
            <>
              <Link
                className="block break-all text-xs mt-4 text-gray-400 hover:underline hover:text-black"
                href={ImageURL}
              >
                <span className="text-gray-500 font-bold text-md">
                  Click this link to view full image:
                </span>{" "}
                {ImageURL}
              </Link>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="text-center text-gray-500 dark:text-gray-400 mb-4 text-sm">
            No image uploaded. Drag & Drop your image or browse files below.
          </div>
        </>
      )}

      <Card className="w-full flex flex-col justify-center items-center gap-4 border-dashed border-2 border-gray-300 rounded-lg dark:border-gray-700 p-4">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {selectedFile
              ? "Selected image. Ready to upload."
              : "Drag & Drop your image here"}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-gray-500 dark:text-gray-400 text-sm text-center">
            Or
          </div>

          <label
            htmlFor="file-upload"
            className="w-full justify-center items-center flex "
          >
            {/* <Button variant="outline">Browse files</Button> */}
            <Input
              accept="image/**"
              className="cursor-pointer text-gray-400 hover:bg-gray-100 transition text-sm"
              id="file-upload"
              type="file"
              onChange={handleFileChange}
            />
          </label>

          {selectedFile && (
            <Button
              className="w-full"
              variant="outline"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
