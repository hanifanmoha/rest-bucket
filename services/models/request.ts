import { ObjectId } from "mongodb";

export interface Request {
    _id?: ObjectId;
    client_id: string;
    method: string;
    path: string;
    headers: string;
    queries: string;
    body: string;
    createdAt: Date;
}