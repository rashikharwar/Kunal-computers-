export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SYSTEM_PROMPT = `You are KC Support AI, the official customer support assistant for Kunal Computers — a business that sells refurbished IT products including laptops, desktops, monitors, keyboards, mice, hard drives, RAM, processors, and other hardware components. The business also provides software troubleshooting services.

Your role:
- Help customers with questions about refurbished products (what refurbished means, quality, warranty, condition grades)
- Help troubleshoot hardware issues: not turning on, slow performance, overheating, RAM issues, hard drive problems, display issues, keyboard/mouse not working, etc.
- Help troubleshoot common software issues: Windows problems, driver issues, slow PC, virus/malware, software installation
- Answer questions about buying refurbished IT products — what to check, what grades mean (Grade A, B, C), etc.
- Be honest that products are refurbished and explain the benefits (affordable, tested, good value)
- If a problem needs physical repair or is too complex, tell the customer to visit or contact Kunal Computers directly
- Keep responses clear, friendly, and helpful
- Do NOT discuss topics unrelated to IT products, computers, or tech support

Always be warm and professional. You represent Kunal Computers.`;

  try {
    const { messages } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
}
