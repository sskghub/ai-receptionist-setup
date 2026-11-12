# CLAUDE.md: set up the AI Receptionist

You are helping a viewer set up a Telugu AI Receptionist that answers their shop's phone. It runs on Sarvam Voice Agents, and you build it through the Sarvam Voice Agents MCP. Follow this file step by step. Every step is marked:

- **[CLAUDE]**: you do it.
- **[YOU]**: the viewer does it. Give them the exact clicks from `docs/manual-steps.md`, wait for them, then run the step's **Check** before you move on.

Talk to the viewer in short, plain sentences. One step at a time. Tell them in one line what you did after each [CLAUDE] step.

## Rules (read before anything else)

1. **No secrets or personal data in any file you can share.** API keys, the secret word, Sheet links, `/exec` links, phone numbers and emails go only into Sarvam or into the local `my-shop/` folder, which is in `.gitignore`. Never commit `my-shop/`.
2. **Never ask for an API key, password, OTP, PAN or Aadhaar in chat.** The viewer types those into Google or Sarvam directly.
3. **Ask before anything that costs money**: renting the number, a real test call through the MCP (`place_test_call`, `verify_phone_number`), simulated test runs, campaigns. Chat tests are fine.
4. **Never delete a deployment.** It releases the phone number for good. To change the agent version: pause, change `app_version`, resume.
5. **Never invent shop details.** Prices, timings, rules and items come from the viewer or from the Tierwell Cakes example files, nothing else.
6. **Read the MCP's own playbooks before each kind of write** (for example `sarvam://playbooks/agents`, `sarvam://playbooks/telephony`). Field names in this repo are what worked on 2026-11-12; if the MCP's schema differs, follow the MCP and keep the same result.
7. This is an inbound receptionist only. Do not build outbound calling.
8. Audience copy (greeting aside) is in English. Do not name or compare other AI calling platforms.

## Step 0. Plan with the viewer [CLAUDE]

Ask two questions, one at a time:

1. "Which do you want: **Part 1** (the agent, tested in chat and in Sarvam's browser test, no phone number), **Part 1 + Part 2** (a real number, live stock, every call saved, handoff to the owner), or **Part 2 only** (you already have a Part 1 agent)?"
2. "Build the **Tierwell Cakes** example as it is, or build it for **your own shop**?"

Then show this checklist in one message, trimmed to the parts they chose, and say which steps are theirs.

| You need | For | Cost |
|---|---|---|
| A Sarvam account (indus.sarvam.ai/samvaad) | Part 1 | Usage is paid from Sarvam credits |
| Claude Code with the Sarvam MCP | Part 1 | Free (I add it) |
| A Google account | Part 2 | Free |
| A free Google Cloud API key (Sheets API only) | Part 2 | Free |
| Sarvam credits | Part 2 | ₹3.50 a minute of calls, plus ₹0.20 per 30 s of line |
| One-time KYC: PAN + Aadhaar through DigiLocker, OTP on the Aadhaar mobile | Part 2 | Free |
| A rented Sarvam number | Part 2 | ₹59 per 30 days from credits, auto-renews |
| The shop's mobile (forwards missed calls to the AI) | Part 2 | Your plan |
| A second Indian phone for handoffs (owner or staff, not the shop mobile) | Part 2 | ₹0.40 per 30 s of transfer |

Running cost example: 10 calls a day, 90 seconds each, is about **₹2,820 a month with GST** (AI minutes ₹2,100, line ₹180, transfers ₹48, number ₹59, plus 18% GST). Sheets, script and emails are free. Rates checked 2026-11-11.

If they chose **their own shop**, do Step 0b now. Otherwise skip it.

## Step 0b. Collect the shop's details [CLAUDE]

Ask one question at a time, and wait for each answer:

1. Shop name, type of shop and city.
2. What callers usually want (order, booking, enquiry...).
3. Menu or services with prices and sizes.
4. Timings.
5. Delivery, pickup or home-visit rules, and notice needed.
6. How customers pay or confirm (for example WhatsApp + UPI advance).
7. What should go to the owner (complaints, bulk orders, anything else).
8. Language mix: Telugu-English (default), or another.

Then write these files in `my-shop/` (create the folder):
- `instructions.md`: rewrite `part-1-agent/instructions.md` for their shop. Keep every section, the speaking style and every guardrail. Change only the business details.
- `menu.md`: like `part-1-agent/menu.md`, from their answers.
- `pronunciations.json`: their shop name and any hard words, like `part-1-agent/pronunciations.json`.
- `settings.md`: like `part-1-agent/agent-settings.md`, with their greeting, names and important words. Keep the four after-call variables; rename the order fields if the shop is not a bakery.
- For Part 2, `stock.csv` with the same six columns as `part-2-live/stock.csv` (`item, size, price_inr, eggless, ready_now, notes`). For a shop without "eggless", keep the column and write `-`.

Show the viewer the greeting and the menu, and get a yes before you build.

---

# Part 1: the agent

## Step 1. Sarvam account [YOU]

Clicks: `docs/manual-steps.md` M1.
**Check:** the viewer says they can see the Voice Agents workspace.

## Step 2. Add the Sarvam MCP [CLAUDE]

First check if it is already there: `claude mcp list`. If `sarvam-voice-agents` is missing, run:

```bash
claude mcp add --transport http --scope user sarvam-voice-agents https://mcp.sarvam.ai/voice-agents
```

## Step 3. Restart and sign in [YOU]

Clicks: M2. Before they restart, tell them to come back to this folder and say "continue the AI Receptionist setup". Your progress is in this file and `my-shop/`, so you pick up from Step 4.
**Check:** call the MCP `agents` tool with `operation: list`. Any answer, even an empty list, means it works.

## Step 4. Build the agent [CLAUDE]

Use `part-1-agent/` (Tierwell Cakes) or `my-shop/` (own shop). In order:

1. Create the agent with the name, greeting and prompt (`instructions.md`, word for word, one state).
2. Create the knowledge base, upload `menu.md`, wait until processing finishes, attach it.
3. Languages, voice (list voices first and tell the viewer which you picked), pronunciations, important words, call handling: all from `agent-settings.md` (or `my-shop/settings.md`).
4. Add the four after-call variables from `agent-settings.md`.
5. Commit a new version. Give the viewer the link to the agent in the Sarvam dashboard.

**Check:** read the agent back (`agents` get, with `prompt`, `variables`, `intro`) and confirm the greeting, the prompt size and the four variables. Then a free chat test (`send_chat`): ask the price of one menu item and confirm the answer matches the menu.

## Step 5. Talk to it [YOU]

Clicks: M3. Suggested lines for the Tierwell example:
- `Repu ma papa birthday. Oka chocolate cake kavali, eggless.`
- `Mango cheesecake untunda? Entha?` (must not invent a price)
- `Mee shop number cheppandi.` (must not say a number)

**Check:** ask the viewer if anything sounded wrong. Fix the prompt, commit again, repeat.

Part 1 ends here. If they chose Part 1 only, finish with "What next" at the bottom.

---

# Part 2: real number, live stock, every call saved, owner handoff

For **Part 2 only**, first list the viewer's agents and ask which one to upgrade.

## Step 6. The Stock Sheet [YOU]

If it is their own shop, point them to `my-shop/stock.csv`; otherwise `part-2-live/stock.csv`. Clicks: M4.
**Check:** take the Sheet ID from the link (between `/d/` and `/edit`), keep it in `my-shop/ids.local` only, and run:

```bash
curl -s "https://docs.google.com/spreadsheets/d/<STOCK_SHEET_ID>/gviz/tq?tqx=out:csv&sheet=Stock&headers=1" | head -3
```

The first line must be the header `"item","size","price_inr","eggless","ready_now","notes"`. An HTML page means the Sheet is not shared by link. This check cannot see the tab name (Google falls back to the first tab), so also ask the viewer to confirm the tab is named exactly `Stock`; Step 9 proves it.

## Step 7. The free Google API key [YOU]

Clicks: M5. Remind them: do not paste the key here.
**Check:** the viewer confirms the key is restricted to Google Sheets API.

## Step 8. Create the check_stock tool [CLAUDE]

Create an API tool with every field in `part-2-live/check-stock-tool.md`: run during the conversation, GET, the Sheets API URL with their Sheet ID, timeout 8, the failure message and the reply template exactly. No auth: the MCP cannot attach a secret. Do not commit yet.

## Step 9. Attach the key [YOU]

Clicks: M6. Stress: Name `key`, lowercase.
**Check:** chat test (`send_chat`) on the draft: "Is <an item with ready_now above 0> ready now?" The answer must give the ready count from the Sheet. If the agent says it cannot check, read the tool's last execution: 403 means capital `Key` or a missing key; 400 or 404 means a wrong Sheet ID or tab name.

## Step 10. The Calls Sheet and the Apps Script [CLAUDE then YOU]

[CLAUDE] Make a secret word (`openssl rand -hex 12`), copy `part-2-live/apps-script.gs` to `my-shop/apps-script.gs`, and replace `change-this-to-a-long-random-word` with it. Tell the viewer the file path.

[YOU] Clicks: M7. They paste the `/exec` link to you. Keep it in `my-shop/ids.local` only.

**Check:** send one test row:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST "<EXEC_LINK>" \
  -H "Content-Type: application/json" \
  -d '{"key":"<SECRET_WORD>","call_outcome":"setup_test","call_summary":"Setup test row. Delete me."}'
```

A `302` is normal (Google's redirect after the script runs). Ask the viewer to confirm a row in the `Calls` tab and an email. Then they delete the test row. If there is no row: a `Webhook log` tab means the secret word does not match; a Google sign-in page means "Execute as" or "Who has access" is wrong (fix with Manage deployments > pencil > New version).

## Step 11. The owner's phone [YOU]

Clicks: M8. Repeat the two rules: an Indian number, and never the shop mobile.

## Step 12. Upgrade the agent [CLAUDE]

Apply every change in `part-2-live/agent-changes.md` to the agent draft: the AI greeting, "Checking what is ready now", the complaint line, "Handing the call to a person", the two guardrails, the "who are you" line, the `transferred` variable, and the blind call transfer to the owner's number. Adapt the shop name and words for their shop. Commit a new version.

**Check:** two chat tests.
1. "Owner tho matladali." Reply 1 must end with "okay na?" and call no tool.
2. "Okay." Reply 2 must call `call_transfer` with no words. In chat the transfer reports failed (there is no phone line); that is expected. The real test is Step 16.

## Step 13. Rent the number [YOU]

This costs ₹59 per 30 days from credits. Clicks: M9.
**Check:** list connections and their endpoints with the MCP `telephony` tool; the new number must be there. Tell the viewer the number with a `0` in front, the way Indian callers dial it.

## Step 14. Connect the number [CLAUDE]

Ask the viewer for a yes first ("From now on, every answered call costs about ₹3.50 a minute"). Then create the inbound deployment from `part-2-live/deployment.md`: their agent, the latest committed version, the new number, **no availability window** (answers 24/7), and the call-end webhook with the `/exec` link plus `?key=<SECRET_WORD>` and `metadata: {key: <SECRET_WORD>}`.

**Check:** read the deployment back. Status `active`, the right `app_version`, the number, `inbound_config` empty, `webhook_config.url` ends in `/exec?key=...`.

## Step 15. Forward the shop mobile [YOU]

Clicks: M10 (busy and no-answer codes, `##002#` to undo).
**Check:** the viewer says the carrier confirmed forwarding.

## Step 16. The real test [YOU, then CLAUDE]

Clicks: M11. Then [CLAUDE]: read the latest conversation for this agent from Sarvam (call logs / analytics) and check: the agent answered, `check_stock` ran, the transfer ended the call with reason `CALL_TRANSFER` if they asked for the owner, and the after-call variables are filled. Ask the viewer to confirm the new row and the email.

Known and fine:
- Sarvam lists the webhook delivery as **failed**. That is Google's redirect. The row saves.
- `recording_url` arrives empty. Recordings are only in Sarvam's Call Logs.

## Edge cases to tell the viewer

- Pay as you go takes **4 calls at the same time**. A 5th caller is turned away and not saved. Pro allows 10.
- Credits must cover the ₹59 renewal, or the number is released.
- Changing the agent later: edit, commit, then pause the deployment, change `app_version`, resume.
- Changing the script later: Manage deployments > pencil > New version. Never "New deployment".

## What next

Tell the viewer, in one short message, what is now live and what they can change themselves: `ready_now` in the Stock Sheet any time, menu changes through you (re-upload the knowledge base and commit), and the Calls Sheet on their phone in the Google Sheets app.
