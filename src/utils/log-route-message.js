export default (req) => {
  return {
    method: req.method,
    url: req.url,
    time: Date.now().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    client: {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    },
    headers: req.headers,
    params: req.params,
    query: req.query,
    body: req.body,
    cookies: req.cookies,
    signedCookies: req.signedCookies,
    protocol: req.protocol,
    hostname: req.hostname
  }
}