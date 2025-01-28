import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
	// Verify origin
	const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
	const origin = request.headers.get('origin');

	if (allowedOrigin !== '*' && origin !== allowedOrigin) {
		return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 });
	}

	const searchParams = request.nextUrl.searchParams;
	const pageId = searchParams.get('pageId');
	console.log(pageId);

	if (!pageId) {
		return NextResponse.json({ error: 'Missing pageId parameter' }, { status: 400 });
	}

	try {
		const response = await fetch(`https://notion.so/${pageId}`);
		const content = await response.text();

		return new NextResponse(content, {
			status: 200,
			headers: {
				'Content-Type': 'text/html',
				'Access-Control-Allow-Origin': allowedOrigin,
				'Access-Control-Allow-Methods': 'GET',
				'Access-Control-Allow-Headers': 'Content-Type',
				'Cache-Control': 's-maxage=3600, stale-while-revalidate',
			},
		});
	} catch (error) {
		console.error('Error fetching Notion page:', error);
		return NextResponse.json({ error: 'Failed to fetch Notion page' }, { status: 500 });
	}
}
