import requestManagerInstance, { RequestManager } from "@/repositories/request-db";
import { Request } from "./models/request";
import { CreateRequestSchema } from "./schema/request";

const LIMIT_PER_PAGE = 10
const ONE_HOUR_IN_MILLISECONDS = 60 * 60 * 1000

class RequestService {

    requestManager: RequestManager

    constructor(_requestManager: RequestManager) {
        this.requestManager = _requestManager
    }

    async getRequests(email: string, page: number = 1): Promise<{ requests: Request[], total: number, limit: number }> {
        const limit = LIMIT_PER_PAGE
        const offset = (page - 1) * limit

        const timeLimit = new Date(Date.now() - ONE_HOUR_IN_MILLISECONDS)

        // delete old requests to maintain storage
        this.requestManager.deleteOldRequests(timeLimit)

        const { requests, total } = await this.requestManager.getRequests(email, timeLimit, limit, offset)
        return { requests, total, limit }
    }

    async getRequest(id: string): Promise<Request> {
        return await this.requestManager.getRequest(id)
    }

    async sendRequest(request: CreateRequestSchema): Promise<Request> {
        const newRequest: Request = {
            ...request,
            createdAt: new Date()
        }
        return await this.requestManager.createRequest(newRequest)
    }

}

const requestServiceInstance = new RequestService(requestManagerInstance)

export default requestServiceInstance
