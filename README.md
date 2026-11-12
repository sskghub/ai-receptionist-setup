# AI Receptionist: Telugu phone receptionist for any shop

An AI that answers your shop's phone in Telugu-English. It answers from your menu, takes the full order, checks what is ready right now in a Google Sheet, hands hard calls to the owner, and saves every call as a row in your own Google Sheet with an email to the owner.

It runs on [Sarvam Voice Agents](https://indus.sarvam.ai/samvaad). You do not build it by hand: you give this repo to Claude Code, and Claude builds it through Sarvam's MCP. Claude stops at each step only you can do (login, KYC, API key, number), tells you exactly what to click, and checks it before moving on.

The worked example is **Tierwell Cakes**, an imaginary bakery in Hyderabad. Prices are made up. Claude can build it for your own shop instead.

## Start

Open Claude Code in an empty folder and paste this one line:

```
Clone https://github.com/sskghub/ai-receptionist-setup into this folder, read its CLAUDE.md, and set up the AI Receptionist with me step by step.
```

Claude asks two questions (which parts, which shop), shows the checklist below, then starts.

## What it does

| Part | What you get |
|---|---|
| **Part 1: the agent** | Telugu-English receptionist with your menu, voice and rules. Takes orders, reads them back, never invents prices, never takes card details, says honestly it is an AI. Tested in chat and in Sarvam's browser test. |
| **Part 2: live** | A real Indian number (₹59 per 30 days). Live stock from a Google Sheet the owner edits. Hand-off to the owner's phone. Every call saved to a private Google Sheet with the caller's number, plus an email to the owner. |

## What you need

| You need | For | Cost |
|---|---|---|
| Claude Code | Both | Your Claude plan |
| A Sarvam account | Part 1 | Usage is paid from Sarvam credits |
| A Google account | Part 2 | Free |
| A free Google Cloud API key (Sheets API only) | Part 2 | Free |
| Sarvam credits | Part 2 | ₹3.50 a minute of calls + ₹0.20 per 30 s of line |
| One-time KYC: PAN + Aadhaar through DigiLocker | Part 2 | Free |
| A rented Sarvam number | Part 2 | ₹59 per 30 days |
| The shop's mobile, to forward missed calls | Part 2 | Your plan |
| A second Indian phone for hand-offs (not the shop mobile) | Part 2 | ₹0.40 per 30 s of transfer |

## What it costs to run

Example: 10 calls a day, 90 seconds each.

| Item | Per month |
|---|---|
| AI minutes (₹3.50 a minute, each call rounded up) | ₹2,100 |
| Phone line (₹0.20 per 30 s) | ₹180 |
| Transfers (1 in 10 calls, ₹0.40 per 30 s) | ₹48 |
| Number | ₹59 |
| Google Sheets, API key, script, emails | ₹0 |
| **Total with 18% GST** | **about ₹2,820** |

Rates checked 11 November 2026 on Sarvam's pricing page. Unanswered calls cost nothing.

## Who does what

| Claude does (through the Sarvam MCP) | You do |
|---|---|
| Writes your shop's prompt, menu and stock files | Sign up to Sarvam and sign in to the MCP |
| Builds the agent: prompt, menu knowledge base, voice, languages, after-call details | Make the Stock Sheet and share it as Viewer |
| Creates the check_stock tool | Make the free Google API key and attach it in Sarvam |
| Makes your Apps Script with a secret word | Paste and deploy the Apps Script in your Calls Sheet |
| Adds the hand-off and the AI greeting, commits versions | Give the owner's phone number |
| Connects the number, 24/7, with call saving | KYC and rent the number |
| Tests each step and reads the call logs | Forward the shop mobile, make the real test call |

## Files

| Path | What it is |
|---|---|
| `CLAUDE.md` | The step-by-step guide Claude follows |
| `docs/manual-steps.md` | Exact clicks for every step only you can do |
| `part-1-agent/` | Prompt, menu, pronunciations and settings (Tierwell Cakes example) |
| `part-2-live/apps-script.gs` | Saves each call to your Calls Sheet and emails the owner |
| `part-2-live/stock.csv` | Example Stock Sheet |
| `part-2-live/check-stock-tool.md` | The live stock tool |
| `part-2-live/agent-changes.md` | AI greeting, stock and hand-off sections, `transferred` field |
| `part-2-live/deployment.md` | Number, 24/7 answering, call-end webhook |

Your own details (secret word, links, IDs) go in a local `my-shop/` folder that git ignores. Never commit it.

## Good to know

- Pay as you go handles 4 calls at the same time. A 5th caller is turned away.
- Keep credits above ₹59 on renewal day, or the number is released.
- The owner's hand-off phone must be an Indian number, and not the shop mobile (that loops).
- This answers calls only. AI calls to new leads need telecom registration under TRAI rules, so it is not included.
