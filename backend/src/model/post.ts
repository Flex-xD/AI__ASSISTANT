import mongoose from "mongoose";
import {z} from "zod";


// ? THIS IS THE SCHEMA FOR X'S ( Twitter ) POSTS
const XpostSchema = new mongoose.Schema({
    title:z.object({
        
    })
})

// ? THIS IS THE SCHEMA FOR THREADS POSTS
const ThreadsPostSchema = new mongoose.Schema({
    title:z.object({

    })
})
// ? THIS IS THE SCHEMA REDDIT POSTS
const RedditPostSchema = new mongoose.Schema({
    title:z.object({

    })
})
// ? THIS IS THE SCHEMA FOR LINKDEN'S POSTS
const LinkdenPostSchema = new mongoose.Schema({
    title:z.object({

    })
})