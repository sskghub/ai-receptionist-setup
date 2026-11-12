# Part 1: agent settings

Everything Claude sets on the Sarvam agent in Part 1. The worked example is Tierwell Cakes, an imaginary bakery in Hyderabad. For your own shop, Claude rewrites the business details and keeps the structure.

| Setting | Value (Tierwell Cakes example) |
|---|---|
| Agent name | `Tierwell Cakes Receptionist` |
| Greeting (played exactly as written) | `నమస్తే అండి, Tierwell Cakes. చెప్పండి, ఏం కావాలి?` |
| Prompt | `instructions.md`, word for word (one state) |
| Knowledge base | Name `tierwell-cakes-menu`. Upload `menu.md`, wait until it finishes processing, then attach it to the agent |
| Start language | Telugu |
| Language switching | On. Allowed: Telugu, English, Hindi |
| Output numbers in Indic | Off |
| Voice | Bulbul V4, a natural young Telugu voice, speaking speed 1.15 |
| Pronunciation dictionary | `pronunciations.json` |
| Important words | Chocolate Truffle, Black Forest, Butterscotch, Pineapple, Red Velvet, Vanilla Raspberry, eggless, Tierwell |
| Call goal | Successful when `call_outcome` is `order_taken` |

## After-call details (agent variables)

Sarvam fills these when the call ends. In Part 2 every one becomes a column in your Calls Sheet.

| Name | Type | What to extract |
|---|---|---|
| `call_outcome` | Enum: `order_taken`, `callback_requested`, `enquiry_answered`, `no_action` | order_taken: the caller placed an order and the details were read back and confirmed. callback_requested: the caller raised a complaint or a bulk or custom order request and asked the shop to call back, or left their details for a callback. enquiry_answered: the caller only asked about the menu, prices, timings or availability and the agent answered. no_action: the caller hung up early, the call was wrong number or spam, or nothing else applies. Reply with exactly one of these four values. |
| `call_summary` | String | A short 1-2 line description of what happened on the call. |
| `order_summary` | String | From the call, extract the confirmed order as a short summary: caller name, caller phone number, cake flavour, weight in kg, eggless or regular, message on the cake if any, date and time, pickup or delivery plus address if delivery, and the total price discussed. If no order was placed or confirmed, return an empty string. |
| `escalation_note` | String | From the call, if the caller raised a complaint or a bulk order request, extract: the caller's name, the caller's phone number, and a short note of the complaint or bulk request (what was wrong or what they wanted, including flavour and weight if a bulk order). If the caller had neither a complaint nor a bulk request, return an empty string. |

## Call handling (already proven on real calls)

- Max call length 900 seconds. The caller can interrupt. The agent can end the call.
- Silence nudges: 8 s "Hello, are you still there?", 15 s "Take your time. I am here whenever you are ready.", 20 s "It seems the line is quiet, so I will hang up. Please call <shop> again whenever you like."

## Do not do in Part 1

Do not rent a number, place a phone call, start a campaign or delete anything.
