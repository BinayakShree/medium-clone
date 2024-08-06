import { Hono } from "hono";
import {signupController} from "../controllers/userControllers/signupController";
import {signinController} from "../controllers/userControllers/signinController";

const userRouter=new Hono();

userRouter.post('/signup',signupController)
userRouter.post('/signin',signinController)

export default userRouter