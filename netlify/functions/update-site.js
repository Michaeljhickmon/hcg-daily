const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { html } = JSON.parse(event.body);
  const token = process.env.GITHUB_TOKEN;
  const owner = 'Michaeljhickmon';
  const repo = 'hcg-daily';
  const path = 'index.html';

  // Get current file SHA
  const getFile = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    headers: { 'Authorization': `token ${token}`, 'User-Agent': 'HCG-Deploy' }
  });
  const fileData = await getFile.json();
  const sha = fileData.sha;

  // Update file
  const update = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: { 'Authorization': `token ${token}`, 'User-Agent': 'HCG-Deploy', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Update via Claude',
      content: Buffer.from(html).toString('base64'),
      sha: sha
    })
  });

  const result = await update.json();
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ success: true })
  };
};
