// ============================================================
// BADDEL — Vercel Serverless API: /api/publish
// Handles automated commits to GitHub repo abuhuud/baddel
// Token is stored securely on server-side, never exposed to clients
// ============================================================

const DEFAULT_REPO = 'abuhuud/baddel';
const DEFAULT_BRANCH = 'main';

// Secure server-side token read exclusively from Vercel Environment Variables
function getSecureToken() {
  return (process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '').trim();
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = getSecureToken();

  // Status check endpoint
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ready',
      repo: DEFAULT_REPO,
      branch: DEFAULT_BRANCH,
      hasServerToken: Boolean(token && token.startsWith('ghp_')),
      serverTime: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!token) {
    return res.status(500).json({
      error: 'GitHub Token belum dikonfigurasi di server. Tambahkan GITHUB_TOKEN di Vercel Environment Variables.'
    });
  }

  try {
    const body = req.body || {};
    const fullDB = body.db || body;

    if (!fullDB || !Array.isArray(fullDB.players) || !Array.isArray(fullDB.schedules)) {
      return res.status(400).json({
        error: 'Payload data tidak valid. Membutuhkan object dengan properti players dan schedules.'
      });
    }

    const repo = (body.repo || DEFAULT_REPO).trim();
    const branch = (body.branch || DEFAULT_BRANCH).trim();
    const filePath = 'data/database.json';
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

    // 1. Get existing file SHA on target branch
    let sha = null;
    const getRes = await fetch(`${apiUrl}?ref=${branch}&_=${Date.now()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Baddel-CMS-Publish/1.0'
      }
    });

    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    } else if (getRes.status !== 404) {
      const errJson = await getRes.json().catch(() => ({}));
      return res.status(getRes.status).json({
        error: errJson.message || `Gagal memeriksa status file di GitHub (HTTP ${getRes.status})`
      });
    }

    // 2. Prepare payload for commit
    fullDB.lastUpdated = new Date().toISOString();
    fullDB.version = fullDB.version || '2026.09.19-v4';

    const jsonStr = JSON.stringify(fullDB, null, 2);
    const base64Content = Buffer.from(jsonStr, 'utf8').toString('base64');
    const nowStr = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

    const commitBody = {
      message: `feat(cms): update live website data via Baddel CMS [${nowStr} WIB]`,
      content: base64Content,
      branch: branch
    };
    if (sha) commitBody.sha = sha;

    // 3. Commit to GitHub via PUT
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Baddel-CMS-Publish/1.0'
      },
      body: JSON.stringify(commitBody)
    });

    if (!putRes.ok) {
      const errJson = await putRes.json().catch(() => ({}));
      return res.status(putRes.status).json({
        error: errJson.message || `Gagal commit ke GitHub (HTTP ${putRes.status})`
      });
    }

    const result = await putRes.json();
    const commitSha = result.commit ? result.commit.sha.slice(0, 7) : 'latest';
    const commitUrl = result.commit ? result.commit.html_url : `https://github.com/${repo}/commits/${branch}`;

    return res.status(200).json({
      success: true,
      commitSha,
      commitUrl,
      repo,
      branch,
      message: `Data berhasil di-commit ke GitHub (${commitSha}). Vercel sedang otomatis merebuild dan mendeploy.`,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('[API Publish Error]', err);
    return res.status(500).json({
      error: 'Terjadi kesalahan server internal: ' + err.message
    });
  }
};
