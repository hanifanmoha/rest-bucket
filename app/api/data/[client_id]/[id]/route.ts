import { NextResponse, NextRequest } from 'next/server';
import { GeneralResponse } from '@/utils/response';
import requestServiceInstance from '@/services/request-service';

// Handle GET requests
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ email: string, id: string }> }
): Promise<NextResponse<GeneralResponse>> {

    const { id } = await params

    const request = await requestServiceInstance.getRequest(id)

    return NextResponse.json({
        message: "Request retrieved successfully",
        data: request
    });
}
