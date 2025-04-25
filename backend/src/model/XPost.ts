import mongoose from "mongoose";
import {XPostinput} from "../constants/index"
import { boolean } from "zod";

interface IPostX extends XPostinput , Document {
    createdAt:Date , 
    updatedAt:Date
}

const XpostSchema = new mongoose.Schema<IPostX>({
    title: { 
        type: String, 
        required: true 
    } ,
    content:{
        type: String, 
        required: true
    } ,
    image:[{
        type:String , 
    }] , 
    hashtags:{
        type:String , 
    } ,
    isPosted:{
        type:boolean ,
        default:false ,
        required:true
    }
} , {
    timestamps:true
})

export const XPostModel = mongoose.model<IPostX>("Post", XpostSchema);