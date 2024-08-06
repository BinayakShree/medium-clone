import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import {signupSchema, signupType} from "@ahahtryboy/medium-common/dist/user";
import httpStatusCode from "../../httpcode";
import  {sign} from "hono/jwt";




export async function signupController(c:Context){
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    try{
        const body:signupType=await c.req.json();
        const parsedBody=signupSchema.safeParse(body)
       if(!parsedBody.success){
        return c.json({
            success:false,
            error:'Invalid input',
            statusCode:httpStatusCode.BadRequest,
        },httpStatusCode.BadRequest)
       }
       const checkIfUserAlreadyExists=await prisma.user.findFirst({
        where:{
            email:body.email,
        }
       })
       if(checkIfUserAlreadyExists){
        return c.json({
            success:false,
            error:'User already exists',
            statusCode:httpStatusCode.BadRequest
        },httpStatusCode.BadRequest)
       }
       const dbResponse=await prisma.user.create({
        data:{
            email:body.email,
            name:body?.name,
            password:body.password
        }
       })
       const jwtPayload={
        id:dbResponse.id,
        email:dbResponse.email,
       }
       const token=await sign(jwtPayload,c.env.JWT_SECRET)
       return c.json({
        success:true,
        token:token,
        statusCode:httpStatusCode.OK
       },httpStatusCode.OK)
    }
  catch(error){
    console.log(error)
    c.json({
        success:false,
        error:"Internal Server Error",
        statusCode:httpStatusCode.InternalServerError
    },httpStatusCode.InternalServerError)
  }
}