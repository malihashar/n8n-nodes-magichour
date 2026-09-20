# Launch clearances + completion status

## Clearances (done)

| # | Item | Status |
|---|---|---|
| 1 | Public GitHub | ✅ https://github.com/malihashar/n8n-nodes-magichour |
| 2 | Authorized as Magic Hour branding | ✅ |
| 3 | Docs/support links (Apify parity) | ✅ |
| 4 | `X-MagicHour-Source: n8n` OK with eng | ✅ |

## npm

| Item | Status |
|---|---|
| Package | ✅ **`n8n-nodes-magichour@0.2.3`** (tag push republishes via GHA) |
| Install | Community Nodes → `n8n-nodes-magichour` |
| npm page | https://www.npmjs.com/package/n8n-nodes-magichour |
| Provenance (GHA) | ✅ SLSA on `0.2.2`; republish as `0.2.3` via tag `0.2.3` |
| Trusted Publisher (OIDC) | ⚠️ Form ready; escalate requires **security-key WebAuthn** (cannot automate). Token+provenance publish already works. |
| Account 2FA | ✅ Security key + recovery codes in `~/.config/n8n-mh/` |

## Creator Portal

| Item | Status |
|---|---|
| Account | ✅ `malihasharmh` (verified) |
| Submit | ✅ **Submitted** |
| Automated Review | ✅ **Complete** (passed) |
| Manual Review | ⏳ **Awaiting demo video** (upload Loom/link on portal) |
| Portal URL | https://creators.n8n.io/nodes/n8n-nodes-magichour/integration |

## Local n8n E2E (2026-09-20)

| Check | Result |
|---|---|
| Community install | ✅ `n8n-nodes-magichour.magicHour` (+ Tool type) |
| Credential valid / invalid | ✅ OK / Unauthorized |
| Generate Image wait / no-wait | ✅ exec 1–2 success |
| Text to Video (wait) | ✅ exec 6 success |
| Timeout path (3s) | ✅ exec 7 error with clear timeout message |
| Project Get Status | ✅ exec 5 success |

## Still waiting (external / human)

1. **Demo video** for Creator Portal manual review (5 min, no cuts: install from npm → credential test → common ops → one AI tool action). Upload at the portal page above.  
2. Optional: Trusted Publisher WebAuthn (Touch ID) — provenance already ships via `NPM_TOKEN`  
3. AI Agent UI rows need an LLM credential (tool node already registered)  
