# E2E test matrix (§9)

Run on a **real n8n** instance with the Magic Hour credential configured.
Mark each row when done. Do not submit to Creator Portal until all P0 rows pass.

## P0 — required before submit

| # | Case | Pass? | Notes |
|---|---|---|---|
| 1 | Credential save / invalid key | | Invalid key must fail credential test |
| 2 | Image binary → Image to Video | | Drive or HTTP → MH |
| 3 | Image upload → Image Face Swap | | Two images |
| 4 | Video + image → Video Face Swap | | |
| 5 | Image + audio → Talking Photo | | |
| 6 | Video + audio → Lip Sync | | |
| 7 | Text to Video | | |
| 8 | File → Upload Media utility | | Returns `filePath` |
| 9 | Wait=No → Project Get Status | | |
| 10 | Timeout path | | Low timeout; job still exists on MH |
| 11 | Failed generation | | Bad inputs → clear error |
| 12 | Insufficient credits | | Expect actionable 402 message |
| 13 | Invalid / empty binary | | |
| 14 | Rate limit message | | Burst or force 429 |
| 15 | Batch / loop (sheet ≥5 rows) | | `externalId` round-trips |
| 16 | AI Agent → Generate Image | | |
| 17 | AI Agent → Image to Video | | |
| 18 | AI Agent → Talking Photo | | |

## P1 — before verified launch

| # | Case | Pass? |
|---|---|---|
| 19 | Character Replace | |
| 20 | Edit Image | |
| 21 | n8n Cloud install from verified listing | |
| 22 | Template A import + run | |
| 23 | Template B import + run | |
| 24 | Template C import + run | |
| 25 | Attribution visible in MH analytics (`source=n8n`) | |

## API smoke already done (not a substitute)

- `POST /ai-image-generator` → poll → `complete` + download URL (2026-09-20)
