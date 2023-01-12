import {userDbType} from "../models/models";


declare global {
    declare namespace Express{
        export interface Request {
            user: userDbType | null
        }
    }
}