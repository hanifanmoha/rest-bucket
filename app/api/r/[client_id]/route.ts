import { NextResponse, NextRequest } from 'next/server';
import { GeneralResponse } from '@/utils/response';
import requestServiceInstance from '@/services/request-service';
import { CreateRequestSchema } from '@/services/schema/request';

async function handleRequest(request: NextRequest, params: { client_id: string }): Promise<NextResponse<GeneralResponse>> {
    const { client_id } = params;

    const pathString = ''
    const headers = JSON.stringify(Object.fromEntries(request.headers.entries()))
    const queries = JSON.stringify(Object.fromEntries(request.nextUrl.searchParams.entries()))
    const method = request.method
    let bodyJson = {}
    if (method !== 'GET') {
        bodyJson = await request.json()
    }
    const body = bodyJson ? JSON.stringify(bodyJson) : ''

    const req : CreateRequestSchema = {
        client_id,
        method: request.method,
        path: pathString,
        headers,
        queries,
        body,
    };

    requestServiceInstance.sendRequest(req)

    return NextResponse.json({
        message: "Request retrieved successfully",
        data: req
    });
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ client_id: string }> }
): Promise<NextResponse<GeneralResponse>> {
    return handleRequest(request, await params);
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ client_id: string }> }
): Promise<NextResponse<GeneralResponse>> {
    return handleRequest(request, await params);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ client_id: string }> }
): Promise<NextResponse<GeneralResponse>> {
    return handleRequest(request, await params);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ client_id: string }> }
): Promise<NextResponse<GeneralResponse>> {
    return handleRequest(request, await params);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ client_id: string }> }
): Promise<NextResponse<GeneralResponse>> {
    return handleRequest(request, await params);
}

export async function OPTIONS(
    request: NextRequest,
    { params }: { params: Promise<{ client_id: string }> }
): Promise<NextResponse<GeneralResponse>> {
    return handleRequest(request, await params);
}
