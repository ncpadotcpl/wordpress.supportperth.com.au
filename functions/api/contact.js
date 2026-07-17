// Ported from supportperthwebsitev2/functions/api/contact.js for
// wordpress.supportperth.com.au. Changes from the original: allowed origin,
// auto-reply service list + link. Everything else is byte-identical logic.
export async function onRequestPost({ request, env }) {
  // CORS origin check
  const origin = request.headers.get('Origin') || '';
  const allowedOrigins = ['https://wordpress.supportperth.com.au'];
  if (origin && !allowedOrigins.includes(origin)) {
    return jsonResponse(403, { success: false, message: 'Forbidden' });
  }

  // Rate limiting via KV (requires RATE_LIMITER binding in Pages settings)
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (env.RATE_LIMIT) {
    const key = `contact:${clientIP}`;
    const current = parseInt(await env.RATE_LIMIT.get(key) || '0', 10);
    if (current >= 5) {
      return jsonResponse(429, { success: false, message: 'Too many requests. Please try again later.' });
    }
    await env.RATE_LIMIT.put(key, String(current + 1), { expirationTtl: 3600 });
  }

  let data;

  try {
    data = await request.json();
  } catch {
    return jsonResponse(400, {
      success: false,
      message: 'Invalid JSON payload'
    });
  }

  // Honeypot check — bots fill hidden fields, humans don't
  if (data && data.website_url) {
    // Return fake success so the bot doesn't retry
    return jsonResponse(200, { success: true });
  }

  const { email, source, ab_variant, name, phone, message, services, partial } = data || {};
  const isPartial = partial === true;

  // Optional lead detail — untrusted input, so trim and cap lengths
  const leadName = cleanField(name, 100);
  const leadPhone = cleanField(phone, 40);
  const leadMessage = cleanField(message, 2000);
  const leadServices = Array.isArray(services)
    ? services
        .filter((s) => typeof s === 'string' && s.trim())
        .map((s) => s.trim().slice(0, 60))
        .slice(0, 25)
    : [];

  // Require a valid email OR a phone number (either is a workable lead)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
  const hasValidEmail = !!email && emailRegex.test(email);
  if (email && !hasValidEmail) {
    return jsonResponse(400, {
      success: false,
      message: 'Please provide a valid email address',
      missing: [],
    });
  }
  if (!hasValidEmail && !leadPhone) {
    return jsonResponse(400, {
      success: false,
      message: 'Please provide a valid email address or phone number',
      missing: ['email'],
    });
  }
  const leadContact = hasValidEmail ? email : leadPhone;

  // Extract client metadata from Cloudflare request
  const meta = extractClientMeta(request);
  const submittedAt = new Date();
  const awstTimestamp = formatAWST(submittedAt);

  // Build email content
  const locationTag = meta.city !== 'Unknown' ? ` — ${meta.city}` : '';
  const partialTag = isPartial ? ' (Step 1 — partial)' : '';
  const subject = `New Contact Request (WordPress)${partialTag} – ${leadName ? `${leadName} <${leadContact}>` : leadContact}${locationTag}`;

  const textBody = [
    'New contact request (wordpress.supportperth.com.au):',
    '',
    ...(hasValidEmail ? [`Email: ${email}`] : []),
    ...(leadName ? [`Name: ${leadName}`] : []),
    ...(leadPhone ? [`Phone: ${leadPhone}`] : []),
    ...(leadServices.length ? [`Services: ${leadServices.join(', ')}`] : []),
    ...(leadMessage ? ['', 'Message:', leadMessage] : []),
    `Source: ${source || 'main form'}${ab_variant ? ` (variant ${ab_variant})` : ''}`,
    '',
    '--- Location ---',
    `City: ${meta.city}, ${meta.region}`,
    `Country: ${meta.country}${meta.postalCode ? ` (${meta.postalCode})` : ''}`,
    `Timezone: ${meta.timezone}`,
    `Coordinates: ${meta.latitude || 'N/A'}, ${meta.longitude || 'N/A'}`,
    `ISP: ${meta.isp}${meta.asn ? ` (AS${meta.asn})` : ''}`,
    '',
    '--- Device ---',
    `Browser/OS: ${parseUserAgent(meta.userAgent)}`,
    `Full UA: ${meta.userAgent}`,
    `IP: ${meta.ip}`,
    `Language: ${meta.language}`,
    `Referrer: ${meta.referer}`,
    '',
    `Submitted: ${awstTimestamp} AWST`,
  ].join('\n');

  const coordsHtml = meta.latitude && meta.longitude
    ? `<a href="https://www.google.com/maps?q=${meta.latitude},${meta.longitude}">${meta.latitude}, ${meta.longitude}</a>`
    : 'N/A';

  const htmlBody = `
    <h2>New Contact Request (WordPress)</h2>
    <table style="border-collapse:collapse; font-family:sans-serif; font-size:14px;">
      ${hasValidEmail ? `<tr><td style="padding:4px 12px 4px 0; font-weight:bold;">Email</td><td>${escapeHtml(email)}</td></tr>` : ''}
      ${leadName ? `<tr><td style="padding:4px 12px 4px 0; font-weight:bold;">Name</td><td>${escapeHtml(leadName)}</td></tr>` : ''}
      ${leadPhone ? `<tr><td style="padding:4px 12px 4px 0; font-weight:bold;">Phone</td><td><a href="tel:${escapeHtml(leadPhone.replace(/\s+/g, ''))}">${escapeHtml(leadPhone)}</a></td></tr>` : ''}
      ${leadServices.length ? `<tr><td style="padding:4px 12px 4px 0; font-weight:bold;">Services</td><td>${escapeHtml(leadServices.join(', '))}</td></tr>` : ''}
      <tr><td style="padding:4px 12px 4px 0; font-weight:bold;">Source</td><td>${escapeHtml(source || 'main form')}${ab_variant ? ` (variant ${escapeHtml(ab_variant)})` : ''}</td></tr>
    </table>
    ${leadMessage ? `<h3 style="margin-top:16px;">Message</h3><p style="font-family:sans-serif; font-size:14px; white-space:pre-wrap;">${escapeHtml(leadMessage)}</p>` : ''}
    <h3 style="margin-top:16px;">Location</h3>
    <table style="border-collapse:collapse; font-family:sans-serif; font-size:14px;">
      <tr><td style="padding:4px 12px 4px 0; font-weight:bold;">City</td><td>${escapeHtml(meta.city)}, ${escapeHtml(meta.region)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0; font-weight:bold;">Country</td><td>${escapeHtml(meta.country)}${meta.postalCode ? ` (${escapeHtml(meta.postalCode)})` : ''}</td></tr>
      <tr><td style="padding:4px 12px 4px 0; font-weight:bold;">Timezone</td><td>${escapeHtml(meta.timezone)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0; font-weight:bold;">Coordinates</td><td>${coordsHtml}</td></tr>
      <tr><td style="padding:4px 12px 4px 0; font-weight:bold;">ISP</td><td>${escapeHtml(meta.isp)}${meta.asn ? ` (AS${meta.asn})` : ''}</td></tr>
    </table>
    <h3 style="margin-top:16px;">Device</h3>
    <table style="border-collapse:collapse; font-family:sans-serif; font-size:14px;">
      <tr><td style="padding:4px 12px 4px 0; font-weight:bold;">Browser/OS</td><td>${escapeHtml(parseUserAgent(meta.userAgent))}</td></tr>
      <tr><td style="padding:4px 12px 4px 0; font-weight:bold;">IP Address</td><td>${escapeHtml(meta.ip)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0; font-weight:bold;">Language</td><td>${escapeHtml(meta.language)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0; font-weight:bold;">Referrer</td><td>${escapeHtml(meta.referer)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0; font-weight:bold;">Full User Agent</td><td style="font-size:12px; color:#666;">${escapeHtml(meta.userAgent)}</td></tr>
    </table>
    <p style="margin-top:16px; color:#666;"><strong>Submitted:</strong> ${escapeHtml(awstTimestamp)} AWST</p>
  `;

  // Send Telegram notification directly via the Telegram Bot API.
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    try {
      const tgText = [
        `\u{1F514} <b>New Contact Request${partialTag} — Support Perth WordPress</b>`,
        '',
        ...(hasValidEmail ? [`\u{1F4E7} <b>Email:</b> ${escapeHtml(email)}`] : []),
        ...(leadName ? [`\u{1F464} <b>Name:</b> ${escapeHtml(leadName)}`] : []),
        ...(leadPhone ? [`\u{1F4DE} <b>Phone:</b> ${escapeHtml(leadPhone)}`] : []),
        ...(leadServices.length ? [`\u{1F6E0} <b>Services:</b> ${escapeHtml(leadServices.join(', '))}`] : []),
        ...(leadMessage ? [`\u{1F4AC} <b>Message:</b> ${escapeHtml(leadMessage.slice(0, 500))}${leadMessage.length > 500 ? '…' : ''}`] : []),
        `\u{1F4CD} <b>Source:</b> ${escapeHtml(source || 'main form')}${ab_variant ? ` (variant ${escapeHtml(ab_variant)})` : ''}`,
        '',
        '\u{1F30F} <b>Location</b>',
        `    City: ${escapeHtml(meta.city)}, ${escapeHtml(meta.region)}`,
        `    Country: ${escapeHtml(meta.country)}${meta.postalCode ? ` (${escapeHtml(meta.postalCode)})` : ''}`,
        `    Timezone: ${escapeHtml(meta.timezone)}`,
        `    ISP: ${escapeHtml(meta.isp)}${meta.asn ? ` (AS${meta.asn})` : ''}`,
        '',
        '\u{1F4BB} <b>Device</b>',
        `    ${escapeHtml(parseUserAgent(meta.userAgent))}`,
        `    IP: ${escapeHtml(meta.ip)}`,
        `    Language: ${escapeHtml(meta.language.split(',')[0])}`,
        '',
        `\u{1F517} <b>Referrer:</b> ${escapeHtml(meta.referer)}`,
        `\u{1F552} <b>Submitted:</b> ${escapeHtml(awstTimestamp)} AWST`,
      ].join('\n');

      await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: tgText,
            parse_mode: 'HTML',
          }),
        }
      );
    } catch (err) {
      // Non-fatal — log and continue so the email still sends
      console.error('[Telegram] Notification failed:', err);
    }
  }

  // Send via SMTP2GO API
  const smtp2goRes = await fetch('https://api.smtp2go.com/v3/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      api_key: env.SMTP2GO_API_KEY,
      to: [env.TO_EMAIL],
      sender: env.FROM_EMAIL,
      subject,
      text_body: textBody,
      html_body: htmlBody,
      ...(hasValidEmail ? { reply_to: email } : {})
    })
  });

  const smtp2goResult = await smtp2goRes.json();

  if (!smtp2goRes.ok || smtp2goResult?.data?.failed > 0) {
    console.error('SMTP2GO error:', smtp2goResult);

    return jsonResponse(500, {
      success: false,
      message: 'Failed to send email'
    });
  }

  // Auto-reply to the lead — non-fatal; admin notification already succeeded.
  // Phone-only leads get a call back instead of an email.
  try {
    if (!hasValidEmail || isPartial) {
      return jsonResponse(200, { success: true });
    }
    const autoReplyText = [
      'Thanks for reaching out to Support Perth.',
      '',
      "I'm Aaron — I personally handle every support request. If your site is down or hacked, sit tight: it jumps the queue and I'll be in touch shortly.",
      '',
      "Here's what I help Perth businesses with on WordPress:",
      '',
      '  - New site builds and rebuilds',
      '  - Maintenance and updates (core, plugins, themes)',
      '  - Emergency fixes — white screens, fatal errors, broken plugins',
      '  - Hosting and migrations',
      '  - Security hardening and malware cleanup',
      '  - Speed and Core Web Vitals optimisation',
      '  - WooCommerce support',
      '  - Content and SEO upkeep — month-to-month, no lock-in',
      '',
      'Support Perth is rated 5.0 out of 5.0 on Google across 25 reviews.',
      '',
      '"Aaron is a pleasure to deal with and certainly knows his stuff! Helped us out enormously." — Gavin K.',
      '',
      '"Very professional, went above and beyond." — Jayden J.',
      '',
      "Just reply to this email with a bit about what you need, and I'll personally get back to you — usually within a few hours.",
      '',
      'Aaron Waltman',
      'Support Perth',
      '1300 769 337',
      'wordpress.supportperth.com.au',
    ].join('\n');

    const autoReplyHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #2c353a; max-width: 600px; margin: 0 auto; font-size: 15px; line-height: 1.6;">
        <p>Thanks for reaching out to Support Perth.</p>
        <p>I'm Aaron &mdash; I personally handle every support request. If your site is down or hacked, sit tight: <strong>it jumps the queue</strong> and I'll be in touch shortly.</p>
        <p>Here's what I help Perth businesses with on WordPress:</p>
        <ul style="padding-left: 20px; margin: 12px 0;">
          <li style="margin-bottom: 6px;">New site builds and rebuilds</li>
          <li style="margin-bottom: 6px;">Maintenance and updates (core, plugins, themes)</li>
          <li style="margin-bottom: 6px;">Emergency fixes &mdash; white screens, fatal errors, broken plugins</li>
          <li style="margin-bottom: 6px;">Hosting and migrations</li>
          <li style="margin-bottom: 6px;">Security hardening and malware cleanup</li>
          <li style="margin-bottom: 6px;">Speed and Core Web Vitals optimisation</li>
          <li style="margin-bottom: 6px;">WooCommerce support</li>
          <li style="margin-bottom: 6px;">Content and SEO upkeep &mdash; month-to-month, no lock-in</li>
        </ul>
        <p style="font-size: 16px;"><strong>Support Perth is rated 5.0 out of 5.0 on Google across 25 reviews.</strong></p>
        <blockquote style="border-left: 3px solid #22416D; margin: 16px 0; padding: 10px 16px; background: #f7f8f9; font-style: italic;">
          &ldquo;Aaron is a pleasure to deal with and certainly knows his stuff! Helped us out enormously.&rdquo;<br>
          <span style="font-style: normal; color: #6b7280;">&mdash; Gavin K.</span>
        </blockquote>
        <blockquote style="border-left: 3px solid #22416D; margin: 16px 0; padding: 10px 16px; background: #f7f8f9; font-style: italic;">
          &ldquo;Very professional, went above and beyond.&rdquo;<br>
          <span style="font-style: normal; color: #6b7280;">&mdash; Jayden J.</span>
        </blockquote>
        <p>Just reply to this email with a bit about what you need, and I'll personally get back to you &mdash; usually within a few hours.</p>
        <p style="margin-top: 24px;">
          <strong>Aaron Waltman</strong><br>
          <span style="color: #6b7280;">Support Perth</span><br>
          <span style="color: #6b7280;">1300 769 337</span><br>
          <a href="https://wordpress.supportperth.com.au" style="color: #22416D; text-decoration: none;">wordpress.supportperth.com.au</a>
        </p>
      </div>
    `;

    await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: env.SMTP2GO_API_KEY,
        to: [email],
        sender: env.FROM_EMAIL,
        subject: 'Thanks for reaching out',
        text_body: autoReplyText,
        html_body: autoReplyHtml,
      }),
    });
  } catch (err) {
    console.error('[Auto-reply] Failed to send follow-up email:', err);
  }

  return jsonResponse(200, { success: true });
}

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------ */

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function cleanField(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function extractClientMeta(request) {
  const cf = request.cf || {};
  return {
    ip:         request.headers.get('CF-Connecting-IP') || 'Unknown',
    country:    cf.country || request.headers.get('CF-IPCountry') || 'Unknown',
    city:       cf.city || 'Unknown',
    region:     cf.region || 'Unknown',
    timezone:   cf.timezone || 'Unknown',
    latitude:   cf.latitude || '',
    longitude:  cf.longitude || '',
    postalCode: cf.postalCode || '',
    asn:        cf.asn || '',
    isp:        cf.asOrganization || 'Unknown',
    userAgent:  request.headers.get('User-Agent') || 'Unknown',
    referer:    request.headers.get('Referer') || 'Direct',
    language:   request.headers.get('Accept-Language') || 'Unknown',
  };
}

function formatAWST(date) {
  return date.toLocaleString('en-AU', {
    timeZone: 'Australia/Perth',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function parseUserAgent(ua) {
  if (!ua || ua === 'Unknown') return 'Unknown';

  let browser = 'Unknown browser';
  if (ua.includes('Firefox/'))      browser = 'Firefox';
  else if (ua.includes('Edg/'))     browser = 'Edge';
  else if (ua.includes('OPR/'))     browser = 'Opera';
  else if (ua.includes('Chrome/'))  browser = 'Chrome';
  else if (ua.includes('Safari/'))  browser = 'Safari';

  let os = 'Unknown OS';
  if (ua.includes('iPhone'))        os = 'iPhone';
  else if (ua.includes('iPad'))     os = 'iPad';
  else if (ua.includes('Android'))  os = 'Android';
  else if (ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('Windows'))  os = 'Windows';
  else if (ua.includes('Linux'))    os = 'Linux';
  else if (ua.includes('CrOS'))     os = 'ChromeOS';

  return `${browser} on ${os}`;
}
