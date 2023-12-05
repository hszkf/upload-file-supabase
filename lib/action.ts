"use server";

import { revalidatePath } from "next/cache"
import prisma from './prisma';

interface imageProps {
    user_id: string;
    image_url: string;
    path: string;
}

export async function createImageMetadata({ user_id, image_url, path }: imageProps) {
    try {
        await prisma.image.upsert({
            where: {
                id: user_id
            },
            update: {
                image_url: image_url
            },
            create: {
                id: user_id, image_url: image_url
            }
        });
        revalidatePath(path)
    } catch (error) {
        console.log(error);
        throw error;
    }
}