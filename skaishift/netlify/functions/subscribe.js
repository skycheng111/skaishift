// Netlify serverless function
// Called by the subscribe form on skaishift.netlify.app
// Adds subscriber to Resend Audience + sends welcome email

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  let email;
  try {
    ({ email } = JSON.parse(event.body));
    if (!email || !email.includes("@")) throw new Error("Invalid email");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid email" }) };
  }

  const RESEND_API_KEY   = process.env.RESEND_API_KEY;
  const RESEND_AUDIENCE  = process.env.RESEND_AUDIENCE_ID;
  const FROM_EMAIL       = "skAIshift <news@skaishift.com>";

  try {
    // 1. Add to Resend Audience
    await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE}/contacts`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, subscribed: true }),
    });

    // 2. Send welcome email
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: "You're in. First issue tomorrow at 6AM ET.",
        html: welcomeEmail(email),
      }),
    });

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error("Subscribe error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Subscription failed" }) };
  }
};

function welcomeEmail(email) {
  return `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#F4F4F0;font-family:'IBM Plex Sans',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:24px 16px;">
  <!-- Header -->
  <div style="background:#0F0F0F;border-radius:16px;padding:32px 28px;margin-bottom:20px;text-align:center;">
    <p style="font-family:Arial,sans-serif;font-size:28px;font-weight:900;letter-spacing:0.1em;color:#fff;margin:0 0 8px;">
      SK<span style="color:#F5A623;">AI</span>SHIFT
    </p>
    <p style="color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:0.18em;text-transform:uppercase;margin:0;">
      AI Intelligence Daily
    </p>
  </div>

  <!-- Body -->
  <div style="background:#fff;border-radius:16px;padding:28px;margin-bottom:16px;border:1px solid #E4E4E0;">
    <h1 style="font-size:22px;color:#0F0F0F;margin:0 0 16px;line-height:1.3;">
      You're in. First issue lands tomorrow at 6AM ET.
    </h1>
    <p style="color:#4A4A4A;font-size:14px;line-height:1.8;margin:0 0 20px;">
      Every morning you'll get the AI shifts that matter — what moved, who's making money from it, and what you should do about it. Plain English. No jargon.
    </p>
    <div style="background:#F0FDF4;border-left:3px solid #16A34A;border-radius:8px;padding:16px;margin-bottom:20px;">
      <p style="font-size:11px;color:#16A34A;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 6px;">WHAT TO EXPECT</p>
      <p style="color:#2A2620;font-size:13px;line-height:1.7;margin:0;">
        Top stories of the day · Model updates that change your pipeline · Real income moves from builders in the AI space · Weekly brief with everything that matters
      </p>
    </div>
    <p style="color:#6B6B6B;font-size:13px;line-height:1.7;margin:0;">
      See you at 6AM.
    </p>
  </div>

  <!-- Footer -->
  <p style="text-align:center;color:#9B9B9B;font-size:11px;margin:0;">
    skaishift.com · You're receiving this because you subscribed at skaishift.netlify.app<br/>
    <a href="https://skaishift.netlify.app/unsubscribe?email=${email}" style="color:#9B9B9B;">Unsubscribe</a>
  </p>
</div>
</body>
</html>`;
}
