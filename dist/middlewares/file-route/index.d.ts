import Diesel from "../../main";
export declare function registerFileRoutes(diesel: Diesel, filePath: string, baseRoute: string, extension: string): Promise<void>;
export declare function loadRoutes(diesel: Diesel, dirPath: string, baseRoute: string): Promise<void>;
