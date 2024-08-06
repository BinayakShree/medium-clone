import { Next } from "hono";
import { Context } from "hono";
import httpStatusCode from "../httpcode";
import { verify } from "hono/jwt";

export async function userAuth(c:Context,next:Next){
    try{
        const header=c.req.header('Authorization')
        if(!header){
            return c.json({
                success:false,
                error:'Auth token not provided',
                statusCode:httpStatusCode.BadRequest
            },httpStatusCode.BadRequest)
        }
        const token=header.split(" ")[1]
        if(!token){
            return c.json({
                success:false,
                error:'Auth token not provided',
                statusCode:httpStatusCode.BadRequest
            },httpStatusCode.BadRequest)
        }
        try{
            const jwtPayload=await verify(token,c.env.JWT_SECRET)
            c.set('jwtPayload',jwtPayload)
            await next();
        }
        catch(error){
            return c.json({
                success:false,
                error:'Auth token not valid',
                statusCode:httpStatusCode.Unauthorized
            },httpStatusCode.Unauthorized)
        }
    }

    catch(error){
        c.json({
            success:false,
            error:"Internal Server Error",
            statusCode:httpStatusCode.InternalServerError
        },httpStatusCode.InternalServerError)
      }
}