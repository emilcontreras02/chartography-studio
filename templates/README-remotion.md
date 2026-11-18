# Remotion templates (standard for all Chartography videos since Nov 19, 2026)

Headless Chrome: HS=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
(Remotion's own browser download is blocked; always pass --browser-executable=$HS.)
Install with `npm ci --ignore-scripts`. Remotion is pinned to 4.0.545; fonts are bundled (@fontsource), never loaded from the web.

## Long-form (Top 10, 16:9)
1. Write projects/<date>-long-<slug>/segments.json (hero/narr lines) and top10.json (copy templates/remotion-top10/example.top10.json).
2. `python3 voice_build.py projects/<slug>` -> vo.mp3, speakers.json, words.json
3. `python3 templates/remotion-top10/build.py projects/<slug>` -> projects/<slug>/remotion/
4. In projects/<slug>/remotion: stills `npx remotion still src/index.ts Top10 out/s30.png --frame=900 --browser-executable=$HS`,
   thumbnail `npx remotion still src/index.ts Thumb out/thumb.png --browser-executable=$HS`,
   video `npx remotion render src/index.ts Top10 out/final.mp4 --crf=18 --browser-executable=$HS`
5. Copy final.mp4 / thumb.png to media/ and push; use the commit-SHA raw URL in Metricool.

## Shorts (9:16)
Start from projects/2026-11-22-short-thanksgiving (Remotion): keep its shared pieces (Background, Hero mascot sprites,
Pop, Fade, word Captions, Brand, Source, timing from make_timing.py) and rewrite the scenes for the new story.
Cut Shorts (10 AM) reuse a stretch of the long-form's vo.mp3 (ffmpeg -ss/-to) + a matching words.json slice.
