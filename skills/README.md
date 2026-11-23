# Vendored skills (added Nov 23, 2026, security-reviewed before use)

Copied at a fixed commit so an upstream change can never reach the pipeline unreviewed. To update: re-clone, re-review, re-copy.

| Folder | Source (commit) | License | What the agents use it for |
|---|---|---|---|
| humanizer/ | github.com/blader/humanizer (a32f244, Nov 19, 2026) | MIT | Rewrite every script, caption, title and description so it doesn't read like AI. Never change a fact or number. |
| gsap/ | github.com/greensock/gsap-skills (aed9cfd, Apr 21, 2026) | MIT | Timing/easing rules for GSAP animation (HyperFrames compositions); the easing ideas also apply to Remotion `spring`/`interpolate`. |
| watch/ | github.com/bradautomates/claude-video (03ceb42, Sep 25, 2026) | MIT | Study a reference video: `python3 skills/watch/scripts/watch.py <file.mp4> --detail efficient` -> timestamped frames (+ captions when the file has them). |

## Security review (Nov 23, 2026)
- humanizer: one Markdown file of writing rules + a CI validation script. No code runs, no network.
- gsap: Markdown skill files + framework examples from GreenSock (official). No install scripts, no network.
- watch: Python standard library + ffmpeg/yt-dlp, all subprocess calls use argument lists (no shell). Network only to
  Google Gemini, Groq or OpenAI when a key is configured (none is). Keys would live in ~/.config/watch/.env (created 0600).
  The plugin version adds a SessionStart hook that only runs a setup check; we use the scripts directly, no hook.
- Policy: NO Gemini/Groq/OpenAI key is configured, so videos never leave the workspace (local frames only).
  yt-dlp is not installed in the cloud workspace (Facebook/YouTube downloads are blocked there anyway); give Watch a local file.
