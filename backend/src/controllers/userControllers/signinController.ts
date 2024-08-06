import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { signinSchema, signinType } from "@ahahtryboy/medium-common/dist/user";
import httpStatusCode from "../../httpcode";
import { Jwt } from "hono/utils/jwt";



export async function signinController(c:Context){
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());
    try{
    const body:signinType=await c.req.json()
    const parsedBody=signinSchema.safeParse(body)
    if(!parsedBody.success){
        return c.json({
            success:false,
            error:'Invalid input',
            statusCode:httpStatusCode.BadRequest
        },httpStatusCode.BadRequest)
    }
    const dbResponse=await prisma.user.findFirst({
        where:{
            email:body.email,
            password:body.password,
        }
    })
    if(!dbResponse){
        return c.json({
            success:false,
            error:'Invalid credentials',
            statusCode:httpStatusCode.Unauthorized
        },httpStatusCode.Unauthorized)
    }
    const jwtPayload={
        id:dbResponse.id,
        email:dbResponse.email,
    }
    const token=await Jwt.sign(jwtPayload,c.env.JWT_SECRET)

    return c.json({
        success:true,
        token:token,
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