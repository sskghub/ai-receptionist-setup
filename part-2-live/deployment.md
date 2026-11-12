# Part 2: the inbound deployment (number + call saving)

The deployment ties your rented number to a committed agent version. It also sends every finished call to your Apps Script, which writes one row in the Calls Sheet and emails the owner.

## Deployment config

| Field | Value |
|---|---|
| Name | `<Shop name> Receptionist - inbound` |
| Agent | your agent, the latest **committed** version |
| Connection and number | the Sarvam connection that holds your rented number |
| Availability (`inbound_config`) | **leave it out**. With no window the agent answers 24/7. The console default is 09:00 to 18:00 IST, too short for a shop |
| Call-end webhook (`webhook_config`) | see below |

## Call-end webhook

```json
{
  "url": "https://script.google.com/macros/s/<YOUR_SCRIPT_ID>/exec?key=<YOUR_SECRET_WORD>",
  "metadata": { "key": "<YOUR_SECRET_WORD>" }
}
```

- `<YOUR_SECRET_WORD>` is the `SECRET` you set in `apps-script.gs`. It goes in the link and in `metadata`. The script accepts either.
- Sarvam sends the caller's number (`user_phone_number`), the call length (`duration`) and every after-call variable (`output_agent_variables`). The script turns them into columns, including `caller_number` and `call_seconds`.
- Sarvam will list every delivery as **failed**. That is Google's redirect (302) after the script runs. The row still saves. The script saves each call once, even when Sarvam retries.
- Chat and browser tests do not fire this webhook. Only real phone calls do.

## Changing the agent version later

1. Pause the deployment.
2. Change `app_version` to the new committed version.
3. Resume the deployment.

Warning: **never delete the deployment.** Delete releases the number. A released number cannot come back.

## Do not use an on-end save tool

An earlier build saved calls with an on-end API tool. It could not send the caller's number, and it wrote rows from chat tests. The deployment webhook replaced it. Use the webhook only.
