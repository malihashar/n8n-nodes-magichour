# Launch clearances + completion status

## Clearances (done)

| # | Item | Status |
|---|---|---|
| 1 | Public GitHub | ✅ https://github.com/malihashar/n8n-nodes-magichour |
| 2 | Authorized as Magic Hour branding | ✅ |
| 3 | Docs/support links (Apify parity) | ✅ |
| 4 | `X-MagicHour-Source: n8n` OK with eng | ✅ |

## Live API smoke (2026-09-20) — 9/9

| Test | Result |
|---|---|
| upload-urls auth | ✅ |
| binary upload PUT | ✅ |
| generate-image create + complete + download | ✅ |
| text-to-video create + complete + download | ✅ |
| image-to-video create + complete | ✅ |
| invalid key → 401 | ✅ |

Headers used: `X-MagicHour-Source: n8n`, `User-Agent: magic-hour-n8n/0.2.1`.

## Local n8n load check

- Packed `n8n-nodes-magichour-0.2.1.tgz`
- Installed into `~/.n8n/nodes`
- n8n 2.39.8 started on :5679 → health **200**
- Full UI matrix in `TESTING.md` (Face Swap / Agent / batches) **not** run yet

## Is the integration complete?

**No — not by the brief’s definition of done.**

| DoD | Met? |
|---|---|
| Implementation (node, credential, uploads, async, templates) | ✅ |
| Public source + MagichHour branding authorized | ✅ |
| npm package published (`n8n-nodes-magichour`) | ❌ blocked: no `npm login` on this machine |
| GHA provenance release | ❌ needs publish |
| Full n8n UI / Agent test matrix | ❌ partial (API + install only) |
| Creator Portal submitted + verified in Cloud picker | ❌ |
| n8n.io Magic Hour page | ❌ |

## Blocker for “finish”

Run once on your machine (interactive):

```bash
npm login
cd /Users/ali/repos/n8n-nodes-magichour
# Option A — Trusted Publisher on GitHub, then:
git tag 0.2.1 && git push origin 0.2.1
# Option B — direct:
npm publish --access public
```

Then: install from npm in n8n → finish `TESTING.md` → submit [Creator Portal](https://creators.n8n.io/).
