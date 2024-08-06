import { Hono } from "hono";
import { userAuth } from "../middlewares/userAuth.middleware";
import { createBlogController } from "../controllers/blogControllers/createBlogController";
import { updateBlogController } from "../controllers/blogControllers/updateBlogController";
import { getBlogByIdController } from "../controllers/blogControllers/getBlogByIdController";
import { getBulkBlogController } from "../controllers/blogControllers/getBulkBlogController";

const blogRouter=new Hono();
blogRouter.use('/*',userAuth)
blogRouter.post('/',createBlogController)
blogRouter.put('/:id',updateBlogController)
blogRouter.get('/bulk',getBulkBlogController)
blogRouter.get('/:id',getBlogByIdController)

export default blogRouter