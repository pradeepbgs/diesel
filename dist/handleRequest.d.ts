import type { DieselT } from "./types";
export default function handleRequest(req: Request, url: URL, diesel: DieselT): Promise<Response>;
