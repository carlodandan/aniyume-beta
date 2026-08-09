export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  if (!url.pathname.startsWith('/api/')) {
    return next();
  }

  const upstream = 'https://lightanime-api.webbase.workers.dev';
  const targetUrl = new URL(url.pathname.replace(/^\/api/, '') + url.search, upstream);

  const headers = new Headers(request.headers);
  headers.set('ngrok-skip-browser-warning', 'true');

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.set('Access-Control-Allow-Origin', '*');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}
