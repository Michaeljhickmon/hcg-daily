exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method not allowed' };
  }

  try {
    const { html } = JSON.parse(event.body);
    const token = process.env.GITHUB_TOKEN;
    const owner = 'Michaeljhickmon';
    const repo = 'hcg-daily';
    const path = 'index.html';

    const getFile = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { 'Authorization': `token ${token}`, 'User-Agent': 'HCG-Deploy' }
    });
    const fileData = await getFile.json();
    const sha = fileData.sha;

    const update = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: { 'Authorization': `token ${token}`, 'User-Agent': 'HCG-Deploy', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Update via Claude',
        content: Buffer.from(html).toString('base64'),
        sha
      })
    });

    const result = await update.json();
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
