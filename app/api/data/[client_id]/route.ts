import { NextResponse, NextRequest } from 'next/server';
import { GeneralResponse } from '@/utils/response';
import requestServiceInstance from '@/services/request-service';

// Handle GET requests
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ email: string }> }
): Promise<NextResponse<GeneralResponse>> {

    const { searchParams } = new URL(request.url)

    const page = Number(searchParams.get("page")) || 1
    const { email } = await params

    const { requests, total, limit } = await requestServiceInstance.getRequests(email, Number(page))

    return NextResponse.json({
        message: "Hello, World!",
        data: {
            requests,
            total,
            limit
        }
    });
}