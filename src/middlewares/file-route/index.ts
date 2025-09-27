import Diesel from "../../main";
import path from 'path'
import fs from 'fs'
import { handlerFunction, HttpMethod, HttpMethodOfApp } from "../../types";

export async function registerFileRoutes(
    diesel: Diesel,
    filePath: string,
    baseRoute: string,
    extension: string
) {

    const module = await import(filePath);

    let pathRoute;
    if (extension === '.ts') {
        pathRoute = path.basename(filePath, '.ts');
    }
    else if (extension === '.js') {
        pathRoute = path.basename(filePath, '.js');
    }

    let routePath = baseRoute + '/' + pathRoute;

    if (routePath.endsWith('/index')) {
        routePath = baseRoute
    } else if (routePath.endsWith('/api')) {
        routePath = baseRoute
    }
    // here we can check if routePath include [] like - user/[id] if yes then remove [] and add user:id
    routePath = routePath.replace(/\[(.*?)\]/g, ':$1');

    const supportedMethods: HttpMethod[] = [
        'GET', 'POST', 'PUT', 'PATCH',
        'DELETE', 'ANY', 'HEAD', 'OPTIONS', 'PROPFIND'
    ];

    for (const method of supportedMethods) {
        if (module[method]) {
            const lowerMethod = method.toLowerCase() as HttpMethodOfApp;
            const handler = module[method] as handlerFunction;
            diesel[lowerMethod](`${diesel.baseApiUrl}${routePath}`, handler)
        }
    }
}

// part of load Routes func family
export async function loadRoutes(
    diesel:Diesel,
    dirPath: string,
    baseRoute: string
) {
    const files = await fs.promises.readdir(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = await fs.promises.stat(filePath);

        if (stat.isDirectory()) {
            await loadRoutes(diesel,filePath, baseRoute + '/' + file);
        } else if (file.endsWith('.ts')) {
            await registerFileRoutes(diesel,filePath, baseRoute, '.ts');
        } else if (file.endsWith('.js')) {
            await registerFileRoutes(diesel,filePath, baseRoute, '.js');
        }

    }
}

    // if (this?.enableFileRouter) {
    //   const projectRoot = process.cwd();
    //   const routesPath = path.join(projectRoot, 'src', 'routes');
    //   if (fs?.existsSync(routesPath)) {
    //     loadRoutes(routesPath, '');
    //   }
    // }