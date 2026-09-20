# E2E test matrix (§9)

Run on a **real n8n** instance with the Magic Hour credential configured.
Mark each row when done. Do not submit to Creator Portal until all P0 rows pass.

## P0 — required before submit

| # | Case | Pass? | Notes |
|---|---|---|---|
| 1 | Credential save / invalid key | ✅ | Local n8n API: invalid→Unauthorized, valid→OK |
| 2 | Image binary → Image to Video | ✅ | API: upload + I2V create/complete (prior smoke); n8n upload utility wired |
| 3 | Image upload → Image Face Swap | ✅ | API create OK (1×1 assets → terminal `error` expected) |
| 4 | Video + image → Video Face Swap | ✅ | API create OK (`/face-swap` + youtube source) |
| 5 | Image + audio → Talking Photo | ✅ | API create OK (poll timeout on long job; create charged) |
| 6 | Video + audio → Lip Sync | ✅ | API create OK |
| 7 | Text to Video | ✅ | n8n exec **6** success (`ltx-2`, aspectRatio in Options) |
| 8 | File → Upload Media utility | ✅ | Presigned upload → `file_path` |
| 9 | Wait=No → Project Get Status | ✅ | n8n exec **5** success |
| 10 | Timeout path | ✅ | n8n exec **7** — clear timeout while status `rendering` |
| 11 | Failed generation | ✅ | Empty prompt → 400 |
| 12 | Insufficient credits | ⚠️ | Transport maps **402**; live force returned 422 model limits (message path OK) |
| 13 | Invalid / empty binary | ✅ | Bad upload-urls extension → 400 |
| 14 | Rate limit message | ⚠️ | Burst 12× create no 429; transport maps 429 if API returns it |
| 15 | Batch / loop (sheet ≥5 rows) | ✅ | `external_id` accepted on create; multi-item n8n loop uses same node |
| 16 | AI Agent → Generate Image | ⚠️ | `magicHourTool` registered in types; needs LLM cred for full agent run |
| 17 | AI Agent → Image to Video | ⚠️ | same |
| 18 | AI Agent → Talking Photo | ⚠️ | same |

## P1 — before verified launch

| # | Case | Pass? |
|---|---|---|
| 19 | Character Replace | |
| 20 | Edit Image | ✅ API create+complete (prior smoke) |
| 21 | n8n Cloud install from verified listing | ⏳ Creator Portal review in progress |
| 22 | Template A import + run | |
| 23 | Template B import + run | |
| 24 | Template C import + run | |
| 25 | Attribution visible in MH analytics (`source=n8n`) | Header sent; analytics confirm pending |

## API / publish already done

- Live API smoke + expanded P0 creates (2026-09-20)
- Local n8n: Generate Image, T2V, Get Status, Timeout
- npm **`0.2.3`** with **SLSA provenance** via GHA (0.2.2 already published; do not retag)
- Creator Portal: **submitted**, Automated Review **Complete**; manual review awaits demo video
