# The steps only you can do

Claude does everything it can through the Sarvam MCP. These steps need your login, your ID, your money or your phone, so Claude stops and waits for you at each one. Claude checks each step before it moves on.

Never paste an API key, a password, an OTP or your Aadhaar into the chat. Claude never needs them.

## Part 1

### M1. Sarvam account

1. Open https://indus.sarvam.ai/samvaad and sign in or sign up.
2. Check that you see the Voice Agents workspace.

### M2. Connect Claude to Sarvam

Claude adds the Sarvam MCP for you. Then:

1. Quit Claude Code and start it again in this folder (the new connection loads on start).
2. Type `/mcp`, pick `sarvam-voice-agents`, choose **Authenticate**.
3. Sign in to Sarvam in the browser window and approve.
4. Come back and tell Claude "done". Claude lists your agents to check it works.

### M3. Test call in the browser

1. Open the agent link Claude gives you.
2. Click **Test agent** > **Voice** > **Start call**, and talk to it.

## Part 2

### M4. The Stock Sheet

1. Open https://sheets.new (a new Google Sheet). Name it "<Shop> - Stock".
2. File > Import > Upload > pick `part-2-live/stock.csv` (or the file Claude made for your shop) > Replace current sheet.
3. Rename the tab at the bottom to exactly `Stock`.
4. Share > General access > **Anyone with the link** > **Viewer** > Done.
5. Copy the Sheet link and paste it to Claude.

This Sheet holds only items, prices and counts, which callers hear anyway. Keep customer data out of it.

### M5. A free Google API key

1. Open https://console.cloud.google.com. If asked, create a project (any name).
2. APIs & Services > **Library** > search **Google Sheets API** > **Enable**.
3. APIs & Services > **Credentials** > **Create credentials** > **API key**.
4. Open the new key > **API restrictions** > **Restrict key** > tick **Google Sheets API** > **Save**.
5. Copy the key. Do not paste it to Claude.

The restriction means the key can only read Sheets that are shared by link. It costs nothing.

### M6. Save the key in Sarvam and attach it to check_stock

After Claude creates the `check_stock` tool:

1. In Sarvam, open **Settings > Secrets** and add a secret with your Google API key as the value.
2. Open the agent > **Tools** > `check_stock` > **Auth**.
3. Type **Api Key**, Location **query**, Name **`key`** (lowercase), Value: the secret from step 1.
4. Save. Tell Claude "done". Claude tests it with a chat question.

Warning: capital `Key` gives error 403.

### M7. The Calls Sheet and the Apps Script

1. Open https://sheets.new. Name it "<Shop> - Calls". Keep it **private** (it will hold customer names and numbers).
2. Extensions > **Apps Script**. Select all the code there and delete it.
3. Paste the script Claude gives you (`my-shop/apps-script.gs`, with your secret word already in it). Save.
4. **Deploy** > **New deployment** > gear icon > **Web app**.
5. Execute as: **Me**. Who has access: **Anyone**. **Deploy**.
6. **Authorize access** > pick your Google account > Advanced > Go to project (unsafe) > Allow. This is your own script.
7. Copy the **Web app** link that ends in `/exec`. Paste it to Claude.

Warning: to change the script later, use **Deploy > Manage deployments > pencil > Version: New version > Deploy**. "New deployment" makes a new link and breaks the connection.

### M8. The owner's phone for handoffs

Tell Claude one Indian mobile number, in `+91` form. Claude puts it only in Sarvam's call transfer setting, never in a file.

- It must be Indian. Transfers to other countries fail.
- It must not be the shop mobile that forwards missed calls to the AI. That makes a loop.

### M9. Rent the number (₹59 per 30 days, paid)

1. Load credits first: the number and every call are paid from your Sarvam credits, not a card.
2. In Sarvam: **Deploy > Phone Numbers > Add Connection > Rent from Sarvam**.
3. Choose **Individual** and enter your email.
4. KYC: PAN card, then Aadhaar through DigiLocker. DigiLocker sends an OTP to the mobile linked to your Aadhaar. A business can use company PAN + GST instead.
5. **Buy Number**. Note the number. Tell Claude "done".

Warning: keep credits above ₹59 on the renewal date. If the credits are too low, Sarvam releases the number and cancels its deployment. There is no grace period.

The number is a landline-style series (080, 079, 11). Callers dial it with `0` or `+91` in front.

### M10. Forward the shop mobile to the AI

On the shop's mobile, dial the code with the new number (with the `0` in front), then press call.

| Carrier | When busy | When not answered | Turn all forwarding off |
|---|---|---|---|
| Airtel, Vi, BSNL | `**67*0<number>#` | `**61*0<number>#` | `##002#` |
| Jio | `*405*0<number>#` | `*403*0<number>#` | `##002#` |

If a code fails, use the phone's own menu: Phone app > Settings > Calls > Call forwarding. On Jio, the SIM usually must be in slot 1. The forwarded leg is an outgoing call from the shop's SIM; unlimited plans usually cover it.

### M11. The real test call

1. From another phone, call the shop mobile and do not pick up. The AI answers.
2. Ask if a cake is ready now. Change its `ready_now` in the Stock Sheet and ask again: the answer changes.
3. Say "owner tho matladali". At "okay na?", say okay. The owner's phone rings.
4. Hang up. Check the Calls Sheet: one new row with `caller_number`, `call_seconds` and `transferred`. Check the owner's email.

A real call costs about ₹3.50 a minute plus the line.
