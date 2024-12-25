import { text } from 'express';
import mangoose from 'mongoose';

const messageSchema = new mangoose.Schema(
    {
        senderId: {
            type: mangoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mangoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            default: "",
        },
        
    },
    {timestamps: true}
);

const Message = mangoose.model("Message", messageSchema);
export default Message;