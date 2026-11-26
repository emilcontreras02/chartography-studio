# MJ Sound Chronicles studio

Animated music-history episodes for the MJ Sound Chronicles YouTube channel (UCBwPlLWZ-b_ZAUWiPOhEg1w).
Style: hand-drawn stick-figure explainer (MJ mascot with orange headphones), warm paper/clay palette, Archivo Black titles, Caveat tags.
Everything is made here: no stock footage, no copyrighted recordings (music is synthesized in numpy).

## Episode layout (copy the latest episode folder to start a new one)

```
episodes/<date>-<slug>/
  script.json      scenes: [{id, paras:[...]}]. Phonetic respellings for names (e.g. Tootahnkahmoon).
  voice.py         Kokoro free voice via ../../chartography_engine (ce.tts_free, ce.transcribe, ce.duration) -> audio/*.mp3, timing.json
  music.py         synthesized bed, sfx, and the "listen" piece -> mix.wav, mix.m4a, music_cue.json
  cues.py          phrase -> time cues per scene -> rm/src/cues.json (prints any missing cues: fix the phrase)
  metadata.json    title, description (chapters), tags, first comment
  rm/              Remotion 4 project. src/lib.tsx (MJ, Stick, Title, Tag, Stage, Tablet...), src/art.tsx (Trumpet, Radio, Globe,
                   Museum, DateCard, Bubble, Column, Plane...), src/scenes*.tsx (one component per script scene), src/Root.tsx (MAP + Thumb)
  shorts/make_shorts.py  vertical 1080x1920 cuts: blurred fill, clip centered, title on top, SUBSCRIBE CTA
```

## Build steps

1. Research facts (WebSearch), write `script.json` (about 6 to 7 min, 10 to 13 scenes: hook, intro, story beats, "is it true?", listen, outro with CTA and next-episode tease).
2. `python3 voice.py` (about 4 min) then `python3 music.py`, copy `timing.json music_cue.json` to `rm/src/`, copy `mix.m4a` to `rm/public/`.
3. Edit the `CUES` dict in `cues.py`, run it until `missing: []`.
4. Write scenes; `cd rm && npm i` (first time), then check frames: `node render.mjs stills "hook:5,tomb:20"` and look at them.
5. `node render.mjs scene hook,intro,...` (about 6x realtime on 2 CPUs), then concat:
   `ffmpeg -f concat -safe 0 -i list.txt -i ../mix.m4a -map 0:v -map 1:a -c:v copy -c:a copy -shortest -movflags +faststart <Title>.mp4`
6. Upload copy for hosting: `ffmpeg -i <Title>.mp4 -c:v libx264 -crf 23 -maxrate 2500k -bufsize 5000k -preset veryfast -c:a copy mjsc-<slug>.mp4`
7. Thumbnail: ChatGPT image (no text, 16:9, bold flat cartoon, MJ shocked on the left, empty top third), downloaded from the
   Claude desktop built-in browser to ~/Downloads, staged, then PIL adds the white outlined title on top + red rotated label.
   Fallback: `node render.mjs thumb` (Remotion Thumb composition).
8. Host: copy mp4 + thumbnail to `media/mjsc/` in this repo, push, use raw.githubusercontent.com URLs.
9. Schedule in Metricool brand 8331796 (MJ Sound Chronicles, youtube): long-form 10:00 PM Asia/Manila, Shorts about 1:00 AM Asia/Manila daily.

Shorts need the source mp4 at the path in `make_shorts.py`; compress Shorts to under ~8 MB (CRF 28) before hosting.
