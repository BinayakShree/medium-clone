import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import httpStatusCode from "../../httpcode";

export async function getBulkBlogController(c:Context){
    try{
        const prisma=new PrismaClient({
            datasourceUrl:c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const dbResponse=await prisma.post.findMany()
        return c.json({
            success:true,
            data:dbResponse,
            statusCode:httpStatusCode.OK
        },httpStatusCode.OK)
    }
    catch(error){
        c.json({
            success:false,
            error:"Internal Server Error",
            statusCode:httpStatusCode.InternalServerError
        },httpStatusCode.InternalServerError)
      }

}