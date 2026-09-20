# Brief status — official Magic Hour n8n integration

Against the “Build and publish the official Magic Hour n8n integration” task.
**This is not complete.** npm existence alone is not the bar; verified discovery in n8n Cloud is.

## Scoreboard

| # | Requirement | Status | Notes |
|---|---|---|---|
| Ownership | `magichourhq/n8n-nodes-magichour` GitHub | ❌ | Live at `malihashar/n8n-nodes-magichour` only — transfer when org access exists |
| Ownership | `@magichourhq/n8n-nodes-magichour` npm | ❌ | Not published; no npm login / org token on this machine |
| Ownership | Creator Portal = company email | ❌ | Not submitted |
| 1 | n8n-node starter + tooling | ✅ | `@n8n/node-cli`, lint/build/release |
| 1 | GHA publish + npm provenance | ⚠️ | `publish.yml` present (token env fixed); needs org repo + OIDC/trusted publisher |
| 2 | API docs / OpenAPI as source of truth | ⚠️ | Catalog synced from `magic-hour-channels` endpoints (MH production OpenAPI dump). Re-fetch from docs.magichour.ai before submit |
| 3 | V1 prioritized ops | ✅ | All V1 ops present (plus extra stable endpoints) |
| 4 | Wait / no-wait + timeout | ✅ | Default wait=yes |
| 5 | Native n8n binary → presigned upload | ✅ | Image/video/audio kinds in transport |
| 5 | Explicit Upload utility | ✅ | File → Upload Media (returns `filePath`) |
| 6 | Credential + test + key link | ✅ | Test via `POST /files/upload-urls` |
| 7 | usableAsTool (AI Agent) | ⚠️ | Flag on; **not** E2E-tested in a real Agent workflow yet |
| 8 | MIT, TS, no runtime deps, lint/build | ✅ | |
| 8 | Public GitHub under company | ❌ | Private/personal until org transfer + public |
| 9 | Full E2E matrix on real n8n | ❌ | API smoke only (image gen). No n8n instance run of I2V/Face Swap/Agent/… |
| 10 | `source=n8n` attribution | ⚠️ | Sends `X-MagicHour-Source: n8n` + UA — **needs backend confirmation** it is counted |
| 11 | 3 templates | ✅ | Under `templates/` |
| 12 | npm publish + Creator Portal + approved | ❌ | Blocked on company GitHub/npm + Portal |

## Definition of done — honest check

| DoD item | Met? |
|---|---|
| Magic Hour owns repo + npm | No |
| Major workflows work E2E **in n8n** | No (API yes, n8n UI no) |
| File uploads work | Code yes; n8n E2E no |
| Async generation works | Code + API smoke yes |
| AI Agent usage tested | No |
| Package meets verification rules | Mostly code-side; ownership/public/provenance publish pending |
| Submitted to n8n | No |
| Approved + searchable in Cloud | No |
| n8n.io Magic Hour page | No |
| Attribution instrumented | Header present; analytics unconfirmed |
| 3 templates published | Drafts in repo; not on n8n template gallery |

## What “continue” still needs from the company

1. Invite maintainer to **GitHub org `magichourhq`** with repo create/transfer.
2. Transfer or recreate repo → make **public**.
3. **npm org `@magichourhq`**: Trusted Publisher for `publish.yml` (or `NPM_TOKEN` secret).
4. Confirm with eng that `X-MagicHour-Source: n8n` (or agreed alternative) lands in usage analytics.
5. **n8n Creator Portal** login with company email → submit package after first provenance publish.
6. Real **n8n Cloud or self-hosted** instance for the §9 test matrix + Agent tests.
7. Publish the three templates in the n8n template flow once the verified node ID is final.

## What is already good to keep

- One node, resource/operation selectors, BYOK credential.
- Async wait default on, timeout, project get-status.
- Binary → upload-urls → `file_path` → generate.
- Output shape with `projectId`, `status`, `creditsCharged`, `outputUrl` / `downloadUrls`, `externalId`.
- Official starter `publish.yml` (provenance-oriented) + CI lint/coverage/build.
- Support/docs URLs point at Magic Hour properties.
