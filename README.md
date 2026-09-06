# n8n-nodes-magichour

Generate and edit video and images with [Magic Hour](https://magichour.ai) from
inside n8n.

This is the official Magic Hour node, maintained by Magic Hour.

## Installation

**n8n Cloud** — search for "Magic Hour" in the nodes panel.

**Self-hosted** — Settings → Community Nodes → Install, then enter
`@magichourhq/n8n-nodes-magichour`.

## Credentials

You need a Magic Hour API key. Create one in the
[developer dashboard](https://magichour.ai/developer?tab=api-keys), then add it
once as a **Magic Hour API** credential. Every Magic Hour node in your
workflows reuses it. Generations are billed to that account.

Saving the credential verifies the key with a read-only call, so a wrong key
fails immediately rather than on your first generation.

## Operations

### Video

| Operation | Inputs |
|---|---|
| Image to Video | image, optional prompt, duration |
| Text to Video | prompt, duration |
| Video Face Swap | face image, target video |
| Talking Photo | portrait, audio |
| Lip Sync | video, audio |
| Character Replace | video, character image |

### Image

| Operation | Inputs |
|---|---|
| Generate Image | prompt |
| Edit Image | image, instruction |
| Image Face Swap | source face, target photo |

### Project

| Operation | Inputs |
|---|---|
| Get Status | project ID, project type |

## Files come straight from the previous node

Every media input accepts either a **file from the previous node** or a
**URL**. "From Previous Node" is the default, so this works with no hosting
step of your own:

```
Google Drive → Magic Hour (Talking Photo) → Google Drive
```

Behind the scenes the node requests a presigned upload URL from Magic Hour,
uploads the bytes, and passes the resulting file reference to the generation.
You never have to make a file publicly reachable.

## Waiting for generations

Magic Hour generations are asynchronous. **Wait for Completion** is on by
default: the node creates the job, polls with backoff, and returns the finished
media URL, so the next node can use it directly.

Turn it off to get the project ID immediately and poll separately with the
**Get Status** operation — useful for very long jobs or when you would rather
not hold a workflow open.

**Timeout** defaults to 15 minutes. On timeout the node reports the project ID,
and the job keeps running on Magic Hour, so nothing is lost.

## Output

```json
{
  "projectId": "clx1234567890",
  "status": "complete",
  "operation": "imageToVideo",
  "creditsCharged": 120,
  "downloadUrl": "https://...",
  "downloadUrls": ["https://..."]
}
```

Magic Hour download URLs expire, so add a node that saves the file if you need
to keep it.

## Batches and loops

Each input item is processed in turn, and output items are paired back to their
input, so results stay aligned when you feed in a spreadsheet or a folder.

Turn on **Continue On Fail** if you would rather a 200-row batch skip a bad row
than stop. Failed items come through with an `error` field.

Magic Hour rate-limits heavy bursts; if you hit one, the node says so and a
Wait node between items resolves it.

## Use with AI Agents

This node is available as a tool, so an AI Agent can call it and fill in the
parameters itself — for example generating an image from a prompt it wrote, or
turning a supplied photo into a video.

## Errors

The node translates Magic Hour's responses into actionable messages: an invalid
key points at the developer dashboard, insufficient credits says so plainly,
and a rate limit suggests the fix rather than repeating the status code.

## Links

- [Magic Hour API documentation](https://docs.magichour.ai)
- [Support](mailto:support@magichour.ai)
- [Issues](https://github.com/magichourhq/n8n-nodes-magichour/issues)

## License

[MIT](LICENSE)
