import { Context } from "hono";
import { createBlogSchema, createBlogType } from "@ahahtryboy/medium-common/dist/blog";
import httpStatusCode from "../../httpcode";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export async function createBlogController(c:Context){
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());
    try{
        const body:createBlogType=await c.req.json();
        const parsedBody=createBlogSchema.safeParse(body);
        if(!parsedBody.success){
            return c.json({
                success:false,
                error:'Invalid input',
                statusCode:httpStatusCode.BadRequest
            },httpStatusCode.BadRequest)
        }
        const authorId=c.get('jwtPayload').id
        const dbResponse=await prisma.post.create({
            data:{
                title:body.title,
                content:body.content,
                authorId:authorId
            }
        })
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
