import { Context } from "hono";
import { updateBlogSchema, updateBlogType } from "@ahahtryboy/medium-common/dist/blog";
import httpStatusCode from "../../httpcode";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export async function updateBlogController(c:Context){
    try{
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const body:updateBlogType=await c.req.json();
    const parsedBody=updateBlogSchema.safeParse(body);
    if((!parsedBody.success)){
        return c.json({
            success:false,
            error:'Invalid input',
            statusCode:httpStatusCode.BadRequest
        },httpStatusCode.BadRequest)
    }
    const updatePayload:updateBlogType={}
    if(body.title){
        updatePayload.title=body.title
    }
    if(body.content){
        updatePayload.content=body.content
    }
    const authorId=c.get('jwtPayload').id
    const dbResponse=await prisma.post.update({
        where:{
            id:c.req.param('id'),
            authorId:authorId
        },
        data:{...updatePayload}
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