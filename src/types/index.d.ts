import {userAccountDbType} from "../models/models";


declare global {
    declare namespace Express{
        export interface Request {
            user: userAccountDbType | null
        }
    }
}