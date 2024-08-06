import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import httpStatusCode from "../../httpcode";

export async function getBlogByIdController(c:Context){
    try{
        const prisma=new PrismaClient({
            datasourceUrl:c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const dbResponse=await prisma.post.findUnique({
            where:{
                id:c.req.param('id')
            }
        })
        if(!dbResponse){
            return c.json({
                success:false,
                error:'Blog not found',
                statusCode:httpStatusCode.NotFound
            },httpStatusCode.NotFound)
        }
        return c.json({
            success:true,
            data:{
                id:dbResponse.id,
                title:dbResponse.title,
                content:dbResponse.content
            },
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