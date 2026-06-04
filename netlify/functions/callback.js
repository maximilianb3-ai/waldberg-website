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

  const payload = JSON.stringify('authorization:github:success:' + JSON.stringify({ token: data.access_token, provider: 'github' }));
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: `<script>window.opener&&window.opener.postMessage(${payload},'*');window.close();</script>`,
  };
};
