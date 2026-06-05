export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return new Response('Missing code', { status: 400 });
    }

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await tokenRes.json();
    const token = data.access_token;

    const html = `<!DOCTYPE html><html><body><script>
      (function() {
        var provider = 'github';
        var token = ${JSON.stringify(token)};
        function receiveMessage(e) {
          window.opener.postMessage(
            'authorization:' + provider + ':success:' + JSON.stringify({ token: token, provider: provider }),
            e.origin
          );
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:' + provider, '*');
      })();
    <\/script></body></html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
};
