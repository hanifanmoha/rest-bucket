import { Request } from "@/services/models/request";
import { MongoClient, Db, Collection, ObjectId } from "mongodb";

const DB_NAME = "rest_bucket"
const COLLECTION_NAME = "requests"

class RequestManager {

    client: MongoClient | null;
    db: Db | null;
    collection: Collection<Request> | null;
    isConnected: boolean;

    constructor() {
        this.client = null;
        this.db = null;
        this.collection = null;
        this.isConnected = false;
    }

    async connect() {
        if (this.isConnected) {
            return this.db
        }

        try {
            const uri = process.env.MONGODB_URI
            if (!uri) {
                throw new Error("MONGODB_URI is not defined")
            }

            this.client = new MongoClient(uri)
            await this.client.connect()
            this.db = this.client.db(DB_NAME)
            this.collection = this.db.collection(COLLECTION_NAME)
            this.isConnected = true

            console.log("Connected to MongoDB")
            return this.db
        } catch (error) {
            console.error("Failed to connect to MongoDB:", error)
            throw error
        }
    }

    async getRequests(client_id: string, timeLimit?: Date, limit: number = 100, offset: number = 0): Promise<{ requests: Request[], total: number }> {

        console.log(`getRequests client_id: ${client_id}, timeLimit: ${timeLimit}, limit: ${limit}, offset: ${offset}`)

        await this.connect()
        if (!this.collection) {
            throw new Error("Collection is not initialized")
        }

        const query: any = { client_id: client_id }

        if (timeLimit) {
            query.createdAt = { $gte: timeLimit }
        }

        try {
            const requests = await this.collection
                .find(query)
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit)
                .toArray()
            const total = await this.collection.countDocuments(query)
            return { requests, total }
        } catch (error) {
            console.error("Failed to get requests:", error)
            throw error
        }
    }

    async getRequest(id: string): Promise<Request> {
        await this.connect()
        if (!this.collection) {
            throw new Error("Collection is not initialized")
        }

        try {
            const request = await this.collection.findOne({ _id: new ObjectId(id) })
            if (!request) {
                throw new Error("Request not found")
            }
            return request
        } catch (error) {
            console.error("Failed to get request:", error)
            throw error
        }
    }

    async createRequest(request: Request): Promise<Request> {
        await this.connect()
        if (!this.collection) {
            throw new Error("Collection is not initialized")
        }

        const newRequest: Request = {
            ...request,
            createdAt: new Date()
        }

        try {
            const result = await this.collection.insertOne(newRequest)
            return {
                ...newRequest,
                _id: result.insertedId
            }
        } catch (error) {
            console.error("Failed to create request:", error)
            throw error
        }
    }

    async deleteOldRequests(timeLimit: Date) {
        // delete all requests with created at before time limit
        await this.connect()
        if (!this.collection) {
            throw new Error("Collection is not initialized")
        }

        try {
            await this.collection.deleteMany({ createdAt: { $lt: timeLimit } })
        } catch (error) {
            console.error("Failed to delete old requests:", error)
            throw error
        }
    }

}

const requestManagerInstance = new RequestManager()

export default requestManagerInstance

export { RequestManager }

