/**
 * AI Receptionist: save every call to your own Google Sheet, free.
 *
 * Sarvam's call-end webhook POSTs each finished call here.
 * The script adds one row to the Calls tab and emails the owner.
 *
 * Setup:
 *   1. Make a new private Google Sheet (for example "My Shop - Calls").
 *   2. Extensions > Apps Script. Select all, paste this file, Save.
 *   3. Change SECRET below to a long random word. Keep it private.
 *   4. Deploy > New deployment > type Web app >
 *        Execute as: Me, Who has access: Anyone > Deploy > Authorize.
 *   5. Copy the Web app link that ends in /exec.
 *
 * To change the script later: Deploy > Manage deployments > pencil >
 * Version: New version > Deploy. This keeps the same /exec link.
 * "New deployment" makes a NEW link, and Sarvam keeps calling the old one.
 *
 * The Calls tab is created on the first call. Every field Sarvam sends
 * becomes a column, so this works for any shop with no edits.
 */

const SECRET = 'change-this-to-a-long-random-word';
const OWNER_EMAIL = ''; // blank = email the Google account that owns this script

function doPost(e) {
  let body = {};
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ error: 'Body is not JSON' });
  }
  // The key can arrive at the top, inside metadata, or in the link (?key=...).
  const key = body.key || (body.metadata && body.metadata.key) || (e.parameter && e.parameter.key);
  if (key !== SECRET) {
    // Note what arrived (field names only, never values) so a wrong setup is easy to see.
    const log = SpreadsheetApp.getActive().getSheetByName('Webhook log') ||
                SpreadsheetApp.getActive().insertSheet('Webhook log');
    log.appendRow([new Date(), 'refused', Object.keys(body).join(', '),
                   body.metadata ? Object.keys(body.metadata).join(', ') : 'no metadata']);
    return json_({ error: 'unauthorized' });
  }

  // Sarvam retries a webhook it thinks failed, so save each call only once.
  if (body.interaction_id) {
    const seen = PropertiesService.getScriptProperties();
    if (seen.getProperty(body.interaction_id)) return json_({ ok: true, duplicate: true });
    seen.setProperty(body.interaction_id, '1');
  }

  // After-call fields arrive inside output_agent_variables, the caller in user_phone_number.
  const v = Object.assign({}, body, body.output_agent_variables || {});
  if (!v.caller_number && body.user_phone_number) v.caller_number = body.user_phone_number;
  // The leading ' keeps +91... as text; without it Sheets drops the +.
  if (v.caller_number) v.caller_number = "'" + String(v.caller_number);
  if (body.duration) v.call_seconds = Math.round(body.duration);
  ['key', 'output_agent_variables', 'final_agent_variables', 'interaction_transcript', 'metadata',
   'app_id', 'app_version', 'deployment_id', 'interaction_id', 'user_phone_number',
   'agent_phone_number', 'duration', 'start_datetime', 'end_datetime']
    .forEach(k => delete v[k]);

  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName('Calls') || ss.insertSheet('Calls');
  let head = sheet.getLastRow() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String) : [];
  if (!head.length) head = ['received_at'];
  Object.keys(v).forEach(k => { if (head.indexOf(k) < 0) head.push(k); });
  sheet.getRange(1, 1, 1, head.length).setValues([head]);

  const now = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm');
  sheet.appendRow(head.map(h => (h === 'received_at' ? now : clean_(v[h]))));

  const to = OWNER_EMAIL || Session.getEffectiveUser().getEmail();
  const kind = clean_(v.call_outcome || v.call_type) || 'call';
  const lines = head.filter(h => h !== 'received_at' && clean_(v[h]) !== '')
                    .map(h => h + ': ' + clean_(v[h]));
  if (to) MailApp.sendEmail(to, 'New call: ' + kind, lines.join('\n') + '\n\nSheet: ' + ss.getUrl());

  return json_({ ok: true });
}

function clean_(x) {
  if (x === undefined || x === null) return '';
  // Unfilled template placeholders like {{cake}} count as empty.
  const s = typeof x === 'object' ? JSON.stringify(x) : String(x).trim();
  return /^\{\{.*\}\}$/.test(s) ? '' : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
