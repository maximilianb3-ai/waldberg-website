exports.handler = async (event) => {
  const code = event.queryStringParameters?.code;
  if (!code) return { statusCode: 400, body: 'Missing code' };

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await res.json();

  if (data.error) {
    const payload = JSON.stringify('authorization:github:error:' + data.error);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `<script>window.opener&&window.opener.postMessage(${payload},'*');window.close();</script>`,
    };
  }

  const token = data.access_token;
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: `<!DOCTYPE html><html><body><script>
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
    <\/script></body></html>`,
  };
};
