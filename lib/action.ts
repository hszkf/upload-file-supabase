"use server";

import { revalidatePath } from "next/cache"
import path from "path";
import prisma from './prisma';

interface imageProps {
    user_id: string;
    image_url: string;
    path: string;
}

interface formWithAvatarProps {
    email: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
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

export async function createformWithAvatar({ email, first_name, last_name, avatar_url }: formWithAvatarProps) {
    try {
        await prisma.formwithavatar.create({
            data: {
                email: email,
                first_name: first_name,
                last_name: last_name,
                avatar_url: avatar_url
            }
        });
        // revalidatePath(path)
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// export async function formWithAvatarProps({ id, email, first_name, last_name, avatar_url }: formWithAvatarProps) {
//     try {
//         await prisma.formwithavatar.upsert({
//             where: {
//                 id
//             },
//             update: {
//                 email: email,
//                 first_name: first_name,
//                 last_name: last_name,
//                 avatar_url: avatar_url
//             },
//             create: {
//                 email: email,
//                 first_name: first_name,
//                 last_name: last_name,
//                 avatar_url: avatar_url
//             }
//         });
//         // revalidatePath(path)
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }