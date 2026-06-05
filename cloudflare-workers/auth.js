export default {
  async fetch(request, env) {
    const params = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: env.CALLBACK_URL,
      scope: 'repo,user',
    });
    return Response.redirect(
      `https://github.com/login/oauth/authorize?${params}`,
      302
    );
  }
};
