import path from "path";
import { v4 as uuid4 } from "uuid";
import { fileURLToPath } from "url";
import fs from "fs";
import type { ContextType } from "diesel-core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(__dirname, "../../public/uploaded");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export const fileSaveMiddleware = async (ctx: ContextType) => {
    try {
        const body = await ctx.body
        const { avatar, coverImage } = body
        if (!ctx.req.files) {
            ctx.req.files = {};
        }

        if (avatar) {
            const avatarFileName = `avatar_${uuid4()}${path.extname(avatar.name)}`;
            const avatarSavePath = path.join(uploadDir, avatarFileName);
            await Bun.write(avatarSavePath, await avatar.arrayBuffer());

            ctx.req.files.avatar = avatarSavePath;
        }

        if (coverImage) {
            const coverImageFileName = `coverImage_${uuid4()}${path.extname(coverImage.name)}`;
            const coverImageSavePath = path.join(uploadDir, coverImageFileName);
            await Bun.write(coverImageSavePath, await coverImage.arrayBuffer());

            ctx.req.files.coverImage = coverImageSavePath;
        }

    } catch (error) {
        console.error("File upload error:", error);
        return ctx.json({ status: 500, message: "Error uploading files" }, 500);
    }
};
