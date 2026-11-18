#!/usr/bin/env bash
# Hardened HyperFrames launcher for Chartography (Nov 18, 2026).
# - pinned version from package-lock.json, installed with --ignore-scripts
# - usage stats off, no HeyGen account or keys, no cloud/share
set -euo pipefail
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1
unset HEYGEN_API_KEY HEYGEN_ACCESS_TOKEN HYPERFRAMES_API_KEY HEYGEN_API_URL HEYGEN_API_BASE ELEVENLABS_API_KEY OPENROUTER_API_KEY GEMINI_API_KEY GOOGLE_API_KEY || true
case "${1:-}" in
  auth|share|cloud|login|publish) echo "blocked: '$1' is disabled for Chartography (no HeyGen account/uploads)" >&2; exit 1;;
esac
exec "$(dirname "$0")/node_modules/.bin/hyperframes" "$@"
