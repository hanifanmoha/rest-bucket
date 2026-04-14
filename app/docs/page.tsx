export default function DocsPage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    return (
        <div className="py-12 max-w-4xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4">REST Bucket Docs</h1>
                <p className="text-lg text-base-content/60">
                    Capture and inspect any HTTP request sent to your personal bucket endpoint.
                </p>
            </div>

            <div className="space-y-8">

                {/* Getting Started */}
                <section className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-4">How It Works</h2>
                        <ol className="list-decimal list-inside space-y-2 mb-4">
                            <li>Open the <a href="/" className="link link-primary">home page</a> — a unique 8-character <strong>Client ID</strong> is automatically generated and saved in your browser.</li>
                            <li>Send any HTTP request to <code className="font-mono bg-base-200 px-2 py-0.5 rounded">/api/r/{'<client_id>'}{'/<any_path>'}</code>.</li>
                            <li>The request (method, path, headers, query params, body) is recorded and appears in your dashboard in real time.</li>
                        </ol>
                        <div className="alert alert-info">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Base URL: <code className="font-mono bg-base-200 px-2 py-1 rounded">{baseUrl}</code></span>
                        </div>
                    </div>
                </section>

                {/* Receive endpoint */}
                <section className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-4">API Endpoints</h2>

                        <div className="space-y-8">

                            {/* Capture */}
                            <div>
                                <h3 className="text-xl font-semibold mb-3">1. Capture a Request</h3>
                                <div className="mockup-code mb-3">
                                    <pre data-prefix="*"><code>ANY /api/r/{'<client_id>'}{'/<path>'}</code></pre>
                                </div>
                                <p className="mb-3">
                                    Send a request using <strong>any HTTP method</strong> (GET, POST, PUT, PATCH, DELETE, …) to any sub-path under your client ID.
                                    The request will be recorded and visible in your dashboard immediately.
                                </p>

                                <div className="overflow-x-auto mb-4">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Segment</th>
                                                <th>Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><code>client_id</code></td>
                                                <td>Your unique 8-character identifier (shown on the home page)</td>
                                            </tr>
                                            <tr>
                                                <td><code>path</code></td>
                                                <td>Any path you want to simulate (e.g. <code>webhook/payment</code>)</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="font-semibold mb-2">Example — POST with JSON body:</p>
                                <div className="mockup-code text-sm mb-4">
                                    <pre><code>{`curl -X POST ${baseUrl}/api/r/abc12345/webhook/payment \\
  -H "Content-Type: application/json" \\
  -d '{"event": "charge.success", "amount": 9900}'`}</code></pre>
                                </div>

                                <p className="font-semibold mb-2">Example — GET with query params:</p>
                                <div className="mockup-code text-sm mb-4">
                                    <pre><code>{`curl "${baseUrl}/api/r/abc12345/ping?env=production&version=2"`}</code></pre>
                                </div>

                                <p className="font-semibold mb-2">Response:</p>
                                <div className="mockup-code text-sm">
                                    <pre><code>{`{
  "message": "Request retrieved successfully",
  "data": {
    "client_id": "abc12345",
    "method": "POST",
    "path": "webhook/payment",
    "headers": "{...}",
    "queries": "{}",
    "body": "{\\"event\\":\\"charge.success\\",\\"amount\\":9900}"
  }
}`}</code></pre>
                                </div>
                            </div>

                            <div className="divider" />

                            {/* List */}
                            <div>
                                <h3 className="text-xl font-semibold mb-3">2. List Recorded Requests</h3>
                                <div className="mockup-code mb-3">
                                    <pre data-prefix="$"><code>GET /api/data/{'<client_id>'}?page=1</code></pre>
                                </div>
                                <p className="mb-3">Returns a paginated list of requests captured for this client ID, sorted newest first.</p>

                                <div className="overflow-x-auto mb-4">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Parameter</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><code>client_id</code></td>
                                                <td>string</td>
                                                <td>Your unique bucket identifier</td>
                                            </tr>
                                            <tr>
                                                <td><code>page</code></td>
                                                <td>number</td>
                                                <td>Page number (optional, default: 1). Page size is 10.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="font-semibold mb-2">Example Request:</p>
                                <div className="mockup-code mb-4">
                                    <pre data-prefix="$"><code>curl {baseUrl}/api/data/abc12345?page=1</code></pre>
                                </div>

                                <p className="font-semibold mb-2">Example Response:</p>
                                <div className="mockup-code text-sm">
                                    <pre><code>{`{
  "message": "Success",
  "data": {
    "requests": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "client_id": "abc12345",
        "method": "POST",
        "path": "webhook/payment",
        "headers": "{\\"content-type\\":\\"application/json\\"}",
        "queries": "{}",
        "body": "{\\"event\\":\\"charge.success\\"}",
        "createdAt": "2026-04-14T10:00:00.000Z"
      }
    ],
    "total": 42,
    "limit": 10
  }
}`}</code></pre>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Notes */}
                <section className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-4">Notes</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>All five standard methods are supported: <strong>GET, POST, PUT, PATCH, DELETE</strong>.</li>
                            <li>Requests are retained for <strong>1 hour</strong> and then automatically deleted.</li>
                            <li>Your Client ID is stored only in <strong>localStorage</strong> — anyone with the same ID can see its requests.</li>
                            <li>The dashboard polls for new requests every <strong>3 seconds</strong> automatically.</li>
                            <li>This service is intended for <strong>development and testing only</strong>.</li>
                        </ul>
                    </div>
                </section>

            </div>
        </div>
    )
}
