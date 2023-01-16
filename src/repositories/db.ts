import {MongoClient} from "mongodb";
import * as dotenv from 'dotenv'
import {blogDbModel, commentDbType, postDbModel, userAccountDbType} from "../models/models";
dotenv.config()



const mongoUri = process.env.MONGO_URL
if (!mongoUri) {
    throw new Error("No mongo URL")
}
console.log("url: ", mongoUri)
const client = new MongoClient(mongoUri)

const db = client.db();

export const blogsCollection = db.collection<blogDbModel>("blogs")
export const postsCollection = db.collection<postDbModel>("posts")
export const userAccountsCollection = db.collection<userAccountDbType>("userAccounts")
export const commentsCollection = db.collection<commentDbType>("comments")


export async function runDb() {
    try {
        // Connect client tot the server
        await client.connect();
        // Establish and verify connection
        await client.db().command({ ping: 1 });
        console.log("Connected successfully to mongo server");
    } catch {
        console.log ("Can not connect to mongo db");
        //Ensures that client will close after finish/error
        await client.close()
    }
}