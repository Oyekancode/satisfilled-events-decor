import { google } from "googleapis";
import type { InquiryPayload } from "./email";

export async function appendInquiryToSheet(payload: InquiryPayload) {
  const {
    GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    GOOGLE_SHEET_ID,
  } = process.env;

  if (
    !GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ||
    !GOOGLE_SHEET_ID
  ) {
    throw new Error("Google Sheets environment variables are not set");
  }

  const auth = new google.auth.JWT({
    email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: GOOGLE_SHEET_ID,
    range: "Inquiries!A:J",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          new Date().toISOString(),
          payload.name,
          payload.phone,
          payload.email,
          payload.eventType,
          payload.eventDate,
          payload.location,
          payload.guestCount,
          payload.vision,
          payload.locale,
        ],
      ],
    },
  });
}
