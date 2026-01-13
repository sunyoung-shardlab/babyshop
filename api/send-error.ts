// Vercel Serverless Function
// Path: /api/send-error

export default async function handler(req: any, res: any) {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, error, user, timestamp, environment } = req.body;
    
    // Slack Webhook URL (환경변수)
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!slackWebhookUrl) {
      return res.status(500).json({ error: 'Slack webhook not configured' });
    }

    // 환경 이모지
    const envEmoji = environment === 'production' ? '🚀' : '🔧';
    const envLabel = environment === 'production' ? 'PRODUCTION' : 'DEVELOPMENT';

    // Slack으로 전송
    const slackResponse = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `${envEmoji} *${envLabel}* - 🚨 *${type}*`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*🚨 에러 발생*\n*환경:* ${envEmoji} *${envLabel}*\n*타입:* ${type}\n*유저:* ${user}\n*에러:* ${error}\n*시간:* ${timestamp}`
            }
          }
        ]
      })
    });

    if (!slackResponse.ok) {
      throw new Error(`Slack API error: ${slackResponse.status}`);
    }

    return res.status(200).json({ success: true });
    
  } catch (err: any) {
    console.error('Failed to send to Slack:', err);
    return res.status(500).json({ error: err.message });
  }
}
