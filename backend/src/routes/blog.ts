import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { Hono } from "hono"
import { verify } from "hono/jwt"


export const blogRouter = new Hono<{
    Bindings : {
        DATABASE_URL : string,
        JWT_SECRET : string
    },
    Variables : {
        userId : any
    }
}>()

blogRouter.use('/*', async (c,next)=>{
    try {
    const token = c.req.header("authorization") || ""
    const user = await verify(token, c.env.JWT_SECRET)
    
    if(user){
        c.set('userId', user.id)
            await next()
        }
    } catch (e) {
        c.status(403)
        return c.json({
            msg : "Unauthorized"
        })
    
    }
})


blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json()

    const post = await prisma.post.create({
        data : {
            title : body.title,
            content : body.content,
            authorId : c.get('userId'),
            published : true
        }
    })
    
    return c.json({
        id : post.id
    })
  })
  
blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json()
    
    await prisma.post.update({
        where : {
            id : body.id,
            authorId : c.get('userId')
        },
        data : {
            title : body.title,
            content : body.content
        }
    })

    return c.text('Updated Post')
  })
  
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const posts = await prisma.post.findMany()

    return c.json(posts)
  })
  
blogRouter.get('/:id', async (c) => {
    const blogId = c.req.param("id")
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const blog  = await prisma.post.findFirst({
        where : {
            id : blogId
        }
    })
    
    return c.json(blog)
  })