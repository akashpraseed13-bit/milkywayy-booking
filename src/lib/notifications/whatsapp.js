const TWILIO_API_BASE = "https://api.twilio.com/2010-04-01";

const TEMPLATE_ENV_KEYS = {
  shoot_confirmation: "TWILIO_CONTENT_SID_SHOOT_CONFIRMATION",
  shoot_reminder: "TWILIO_CONTENT_SID_SHOOT_REMINDER",
  team_on_the_way: "TWILIO_CONTENT_SID_TEAM_ON_THE_WAY",
  team_arrived: "TWILIO_CONTENT_SID_TEAM_ARRIVED",
  shoot_rescheduled: "TWILIO_CONTENT_SID_SHOOT_RESCHEDULED",
  shoot_cancelled: "TWILIO_CONTENT_SID_SHOOT_CANCELLED",
};

const TEMPLATES_FALLBACK = {
  shoot_confirmation: ({ Property_Name, Location, Shoot_Date, Arrival_Window }) =>
    [
      "✅ Property Shoot Confirmed",
      "",
      "Your booking has been successfully confirmed. Here are the details:",
      "",
      `📍 Property: ${Property_Name}, ${Location}`,
      `📅 Date: ${Shoot_Date}`,
      `⏳ Arrival Window: ${Arrival_Window}`,
      "",
      "Our team will arrive within the mentioned time window.",
      "Please ensure the property is clean, ready, and accessible during this period.",
      "",
      "Need to make changes?",
      "",
      "• To reschedule or cancel, tap Reschedule below",
      "• You’ll be redirected to your dashboard to:",
      "  - Modify your booking",
      "  - Download your invoice",
      "",
      "If you’d like to request a different arrival window, simply reply to this message.",
      "Our team will check availability and get back to you shortly.",
    ].join("\n"),
  shoot_reminder: ({ Property_Name, Shoot_Date, Arrival_Window }) =>
    [
      "⏰ Upcoming Property Shoot Reminder",
      "",
      "This is a reminder for your scheduled property shoot:",
      "",
      `📍 Property: ${Property_Name}`,
      `📅 Date: ${Shoot_Date}`,
      `⏳ Arrival Window: ${Arrival_Window}`,
      "",
      "Please ensure:",
      "• Property access is arranged",
      "• All lights are working",
      "• Rooms are clean and clutter-free",
      "",
      "If you need to make any changes, you can reschedule directly from your dashboard or reply to this message for assistance.",
    ].join("\n"),
  team_on_the_way: ({ Property_Name, Arrival_Window }) =>
    [
      "🚗 Our Team Is On the Way",
      "",
      "Our shoot team is currently en route to your property:",
      "",
      `📍 Property: ${Property_Name}`,
      `⏳ Expected Arrival: Within ${Arrival_Window}`,
      "",
      "Please ensure access is available.",
      "If there are any last-minute instructions, feel free to reply to this message.",
    ].join("\n"),
  team_arrived: ({ Property_Name }) =>
    [
      "📸 Our Team Has Arrived",
      "",
      "Our team has arrived at the property:",
      "",
      `📍 Property: ${Property_Name}`,
      "",
      "We’ll begin the shoot shortly.",
      "If you need anything during the shoot, you can reach us here.",
    ].join("\n"),
  shoot_rescheduled: ({ Property_Name, New_Shoot_Date, New_Arrival_Window }) =>
    [
      "🔁 Shoot Rescheduled Successfully",
      "",
      "Your property shoot has been rescheduled with the following details:",
      "",
      `📍 Property: ${Property_Name}`,
      `📅 New Date: ${New_Shoot_Date}`,
      `⏳ New Arrival Window: ${New_Arrival_Window}`,
      "",
      "You can view updated details and download the revised invoice from your dashboard.",
    ].join("\n"),
  shoot_cancelled: ({ Property_Name, Shoot_Date }) =>
    [
      "❌ Property Shoot Cancelled",
      "",
      "Your booking for the following property has been cancelled:",
      "",
      `📍 Property: ${Property_Name}`,
      `📅 Original Date: ${Shoot_Date}`,
      "",
      "If applicable, refund or credit details will be shared as per the cancellation policy.",
      "You can book a new shoot anytime through the portal.",
    ].join("\n"),
};

const getTwilioAuthHeader = () => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  const credentials = Buffer.from(`${sid}:${token}`).toString("base64");
  return `Basic ${credentials}`;
};

const formatWhatsAppNumber = (value) => {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (trimmed.startsWith("whatsapp:")) return trimmed;
  return `whatsapp:${trimmed}`;
};

export async function sendWhatsAppTemplate({
  to,
  templateName,
  variables,
}) {
  const authHeader = getTwilioAuthHeader();
  if (!authHeader) {
    return { success: false, error: "Twilio credentials missing" };
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const contentSid = process.env[TEMPLATE_ENV_KEYS[templateName]];
  const toValue = formatWhatsAppNumber(to);

  if (!toValue) {
    return { success: false, error: "Recipient phone missing" };
  }

  const body = TEMPLATES_FALLBACK[templateName]
    ? TEMPLATES_FALLBACK[templateName](variables)
    : "";

  const payload = new URLSearchParams();
  payload.append("To", toValue);
  if (messagingServiceSid) {
    payload.append("MessagingServiceSid", messagingServiceSid);
  } else if (from) {
    payload.append("From", formatWhatsAppNumber(from));
  }

  if (contentSid) {
    payload.append("ContentSid", contentSid);
    payload.append("ContentVariables", JSON.stringify(variables || {}));
  } else if (body) {
    payload.append("Body", body);
  } else {
    return { success: false, error: "No template content configured" };
  }

  const res = await fetch(
    `${TWILIO_API_BASE}/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    return { success: false, error: text || "Twilio send failed" };
  }

  const data = await res.json();
  return { success: true, data };
}
