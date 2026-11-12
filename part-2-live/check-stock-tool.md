# Part 2: the check_stock tool

An API tool the agent runs **during the conversation**. It reads the Stock Sheet live through the Google Sheets API. The owner edits `ready_now` in the Sheet, and the next caller hears the new answer.

## Tool config

| Field | Value |
|---|---|
| Name | `check_stock` |
| Description | Reads the shop's live stock sheet: every cake with size, price, eggless, ready_now (how many are ready right now) and notes. Call it before saying any cake is ready or available today. |
| When it runs | During the conversation |
| Method | `GET` |
| URL | `https://sheets.googleapis.com/v4/spreadsheets/<STOCK_SHEET_ID>/values/Stock` |
| Timeout | 8 seconds |
| If it fails | Stock check is not working right now. Tell the caller you cannot confirm what is ready this minute, take their order, and say the owner will call back to confirm. |
| Auth | Added by you in the console, see below |

`<STOCK_SHEET_ID>` is the long part of the Sheet link between `/d/` and `/edit`.

## Reply template

Sarvam passes the agent only what the template gives it. This turns each Sheet row into one spoken line and skips the header row:

```
{% for r in values[1:] %}{{r[0]}} {{r[1]}}: price {{r[2]}} rupees, eggless {{r[3]}}, ready now {{r[4]}}{% if r|length > 5 and r[5] %} ({{r[5]}}){% endif %}. {% endfor %}
```

Column order must be: `item, size, price_inr, eggless, ready_now, notes`.

## Auth (you do this in the Sarvam console)

The MCP cannot attach a secret to a tool, so this step is yours.

1. Open the agent > **Tools** > `check_stock` > **Auth**.
2. Type: **Api Key**.
3. Location: **query**.
4. Name: **`key`** (all lowercase).
5. Value: pick the secret that holds your Google API key (made in **Settings > Secrets**), or paste the key in the masked box. Either way Sarvam keeps it as a workspace secret, never as plain text.
6. Save.

Warning: a capital `Key` gives error 403. Google reads only lowercase `key`. Location "Header" gives "Illegal header name".

## Why not something simpler

- An Apps Script link answers with a redirect (302). Sarvam does not follow redirects, so the agent gets nothing.
- The Sheet's CSV link loads, but Sarvam passes only JSON to the agent.
- The Sheets API returns JSON with no redirect. It needs a free API key.
