import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import Diesel from "../../main";
import { fileSaveMiddleware } from "./savefile";
import * as fs from 'fs'
import { ContextType, handlerFunction } from "../../types";

describe("FileSaveMidlleware", () => {

    const app = new Diesel()
    app.post(
        "/upload",
        fileSaveMiddleware({ fields: ["file"] }) as handlerFunction,
        (ctx: ContextType) => {
            return ctx.json({
                savedPath: ctx.req.files["file"],
            });
        }
    );

    app.post(
        "/upload-multiple",
        fileSaveMiddleware({ fields: ["file", 'file2'] }) as handlerFunction,
        (ctx: ContextType) => {
            const file = ctx.req.files.file;
            const file2 = ctx.req.files.file2;
            return ctx.json({
                savedPaths: [file, file2],
            });
        }
    );

    beforeAll(() => {
        app.listen(3006, () => console.log("server started"));
    });

    afterAll(() => {
        app.close()
    });

    it("should save uploaded single file and return path", async () => {
        const formData = new FormData();
        const blob = new Blob(["hello world"]);
        formData.append("file", blob, "test_upload.txt");

        const res = await fetch("http://localhost:3006/upload", {
            method: "POST",
            body: formData,
        });

        expect(res.status).toBe(200);
        const data = await res.json();

        const savedPath = data.savedPath;

        expect(typeof savedPath).toBe("string");
        expect(fs.existsSync(savedPath)).toBe(true);

        const fileContent = fs.readFileSync(savedPath, "utf-8");
        expect(fileContent).toBe("hello world");

        await Bun.file(savedPath).delete()
    });

    it("should save uploaded multiple files and return paths", async () => {
        const formData = new FormData();
        const blob = new Blob(["hello world"]);
        formData.append("file", blob, "test_upload.txt");
        formData.append("file2", blob, "test_upload2.txt");

        const res = await fetch("http://localhost:3006/upload-multiple", {
            method: "POST",
            body: formData,
        });

        expect(res.status).toBe(200);
        const data = await res.json();

        const savedPaths = data.savedPaths;
        expect(Array.isArray(savedPaths)).toBe(true);
        expect(savedPaths.length).toBe(2);

        savedPaths.forEach((savedPath: string) => {
            expect(typeof savedPath).toBe("string");
            expect(fs.existsSync(savedPath)).toBe(true);

            const fileContent = fs.readFileSync(savedPath, "utf-8");
            expect(fileContent).toBe("hello world");

            Bun.file(savedPath).delete()
        });
    });

})