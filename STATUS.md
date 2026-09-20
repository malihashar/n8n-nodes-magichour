# Brief status — Magic Hour n8n integration (personal publish path)

**Ownership decision:** ship under **malihashar** (GitHub + npm + Creator Portal).
Node UI / product name stays **Magic Hour**. No `magichourhq` org required.

## What that changes vs the original brief

| Original brief | Personal path |
|---|---|
| `magichourhq/n8n-nodes-magichour` | `malihashar/n8n-nodes-magichour` ✅ already |
| `@magichourhq/n8n-nodes-magichour` | `n8n-nodes-magichour` (unscoped) — publishable by you |
| Company Creator Portal email | Your email |
| “Official company Verified Partner” | Still possible as **verified community** under your name; Partner/vendor badge may be limited without company |
| Company must own forever | You own; Magic Hour named in node UI, docs links, contributor |

**Unchanged:** product branding in the picker (“Magic Hour”), docs/pricing links to magichour.ai, BYOK keys, `source=n8n` header.

## Scoreboard (updated)

| # | Requirement | Status |
|---|---|---|
| Ownership GitHub | ✅ `malihashar/n8n-nodes-magichour` |
| Ownership npm name | ⚠️ Package renamed to `n8n-nodes-magichour` — **not published yet** |
| Creator Portal | ❌ Submit with your account after npm publish |
| n8n-node tooling + provenance workflow | ✅ |
| V1 ops + wait + binary upload + credential | ✅ |
| Upload utility + 3 templates | ✅ |
| Public repo | ❌ Make GitHub repo **public** before verification |
| npm publish + GHA provenance | ❌ Need `npm login` + Trusted Publisher on this repo |
| E2E on real n8n + AI Agent | ❌ |
| Backend confirms `source=n8n` | ⚠️ ask eng |
| Verified / searchable in Cloud | ❌ after submit + approval |

## Still do next (all under your name)

1. Make the GitHub repo public  
2. `npm login` (your npm user)  
3. npm Trusted Publisher → this GitHub repo / `publish.yml`  
4. Tag `0.2.1` (or run release) → GHA publishes with provenance  
5. Install in n8n: Community Nodes → `n8n-nodes-magichour`  
6. Run `TESTING.md` matrix  
7. Creator Portal submit  
8. Publish templates once node ID is stable  

## Honest branding note

- **Do:** display name “Magic Hour”, link docs/support to Magic Hour, say built for Magic Hour API.  
- **Don’t:** claim the npm scope `@magichourhq` or GitHub org you don’t control.  
- If Magic Hour later wants company ownership, transfer repo + republish under their scope.
