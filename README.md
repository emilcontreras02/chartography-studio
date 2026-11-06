# Chartography Studio

Engine and production guide for the Chartography YouTube channel ("the story behind the numbers").
Content Hub (Google Sheet): https://docs.google.com/spreadsheets/d/1q6-OeswZzUmz2w0R_VQ2Pwc0NXH2iBCeFdwk8v1-V4k/edit
The Brand Guide tab in that sheet is the source of truth for voice, look, accuracy and SEO rules.

## Layout
- `chartography_engine.py` - the engine (fonts, ElevenLabs voice, word timings, drawing helpers, render, thumbnails).
- `projects/<date>-<format>-<slug>/` - one folder per video: `script.txt`, `vo.mp3`, `words.json`, `video.py`, `sync.json`, `sheet.png`.
- `media/` - finished files that Metricool downloads (public raw URLs). Old files are removed after posting.
- `examples/` - worked examples: `pilot_elon_long/render.py` (first long-form, older standalone style) and `short_elon_104/video.py` (engine style - copy this pattern).

Public raw URL of a file: `https://raw.githubusercontent.com/emilcontreras02/chartography-studio/main/<path>`

## How a video is made (Drafter)
1. Research and verify every number (open the source page in this run). Put sources in the Calendar row.
2. Write the narration. Long-form 850-1,100 words (about 6-7.5 min, 5,000-6,500 characters). Shorts are cut from a long-form (see "Saving voice credits").
   Write numbers the way you want them read ("869 billion dollars", "8.3 billion people", "2,540 dollars").
   Short paragraphs; one idea per paragraph. Hook in the first sentence, payoff number in the first 5 s (2 s for Shorts).
3. Voice: `ce.tts(script, 'vo.mp3')` with `ELEVENLABS_API_KEY` set in the environment of that one command only.
4. Timings: `cues = ce.Cues.from_audio('vo.mp3', 'words.json')`. NEVER estimate timings from text length.
   Every reveal is keyed to the moment its words are spoken: `t_split = cues.at('now the big split')`.
   Cues are searched in order; call them in script order. `cues.at` raises if a phrase is not heard - fix the phrase.
5. Scenes: `ce.use_canvas('long'|'short')`; each scene is a function `fn(T, img, d)` where T is ABSOLUTE seconds.
   Use `prog(T, t_cue)` (0..1 fade/rise) for each element. A scene starts ~0.15 s before its first cue:
   `ce.Scene(t_split - 0.15, split_scene)`. First scene starts at 0.
   Helpers: text, text_block, fit_font, counter, pill, pill_row, card, hbars, vbars, line_chart, donut, calendar_grid,
   progress_bar, dot_field, house, person_icon, coin, arrow, hand_underline, chrome (call in every scene, pass the source),
   eyebrow. Palette: BG CREAM MINT AMBER CORAL SLATE MUTED PANEL.
   Fonts: F('serif'|'serifb'|'hand'|'handb'|'sans'|'sansm'|'sansb', size). Fraunces/Caveat lack the glyphs ≈ ≠ ≤ ≥ → -
   write words instead ("about", "is not") or use a sans font for those symbols.
6. Check layouts BEFORE rendering: `ce.still(scenes, T, 'x.png', audio_end)` at the busiest moment of every scene; look at
   each image; fix overlaps, text running off-screen, cut-off words. Shorts: keep key content between y=250 and y=1500
   (YouTube UI covers the bottom and right edge).
7. Render: `ce.render(scenes, 'vo.mp3', 'final.mp4')`; then `ce.sync_report(cues, 'sync.json')` and
   `ce.contact_sheet('final.mp4', [times...], 'sheet.png')`; look at the sheet.
8. Thumbnail (long-form): `ce.thumbnail('thumb.png', top_line, big_number, bottom_word)` or draw a custom one in the same
   style (1280x720, 2-4 words, one huge number). Shorts: `ce.short_cover(...)` is optional.
9. Title, description (with chapters from your scene start times for long-form, first chapter 0:00), tags.
10. Copy final mp4 (+ thumbnail) into `media/`, project files into `projects/...`, commit and push.

## Mascot (every video from Nov 6, 2026)
The Chartography mascot (cap with bar chart, magnifying glass) is in `assets/mascot_sticker.png` (white sticker outline
for the navy background; `assets/mascot.png` = no outline, `assets/logo_full.png` = full round logo).
- **Thumbnail:** always include it. `ce.thumbnail(...)` adds it bottom-right; in a custom design call
  `ce.mascot(img, (x, y), 290)` (about 40% of the height, bottom-right, magnifier pointing at the big number).
  It must never cover text or the number - check at 320x180.
- **Long-form video:** it appears in the opening hook scene (pops in next to the first big number), at the twist
  (`flip=True` if it should look right), and in the final "subscribe to Chartography" scene. 3-4 scenes max, never on
  top of a chart or text: `ce.mascot(img, (x, y), 300, T=T, start=t_cue)` (pops in at the cue and bobs gently).
- **Shorts:** on the hook card (first second) and the last scene, kept inside y=250-1500 and away from the right edge.
- Do not redraw, recolor or distort the mascot; only resize or flip it.

## Voices: ElevenLabs + the free Chartography voice
- `ce.tts_auto(script, 'vo.mp3')` uses ElevenLabs (Jarnathan) while credits last and switches to the free
  Chartography voice (`ce.tts_free`, Kokoro open-source model, 0 credits) when they don't. It returns
  'elevenlabs' or 'free' - write that in the Calendar Notes. Use it instead of `ce.tts` for long-forms.
- The free voice is our own blend (70% am_fenrir + 30% am_michael, speed 0.94, Jarnathan-style pauses), tuned to be
  close in pitch and pace. It is NOT a clone of Jarnathan - never try to clone a real voice.
- ONE VOICE PER VIDEO: never mix the two voices inside one video. Shorts cut from a long-form keep its voice.
- First call downloads the model (~330 MB from GitHub releases) into ~/.cache/chartography/kokoro.

## Saving voice credits (ElevenLabs)
Long-forms are the only thing that should spend credits (about 5,000-6,500 characters each). Shorts cost 0.
- **Shorts are CUT from a long-form's existing voiceover**, never voiced fresh (unless the Calendar row says "fresh Short"
  and more than 15,000 characters are left). Every long-form project MUST commit `vo.mp3` and `words.json` for this.
  ```python
  dur, words = ce.cut_segment('projects/<long>/vo.mp3', 'projects/<long>/words.json',
                              'first words of the first sentence', 'last words of the last sentence',
                              'vo_short.mp3', 'words.json')
  c = ce.Cues(words, dur)   # then build the vertical scenes exactly like examples/short_elon_104
  ```
  Pick a self-contained stretch of 35-60 s that starts on a sentence that works as a hook (a question or a surprising
  number) and ends on a punchline. Design NEW vertical visuals for it (different layout from the long-form scenes) and
  add an on-screen hook card in the first second, so it is a re-edit and not a reupload.
  Each long-form gives 2-3 Shorts; never cut overlapping stretches for two Shorts.
- Never re-voice a whole script. A missed sentence in `sentence_times` is almost always the transcriber, not the voice:
  fix the cue phrase. If a narration line really must change, voice ONLY that paragraph and splice it in
  (cut_segment before/after + ffmpeg concat).
- Check every fact BEFORE calling `ce.tts`, so the Reviewer never needs a re-voice.

## Originality
Each video needs its own question, data and structure. Do not copy a previous video's scene list with new numbers.
Vary openings (counter, question, comparison, map-like dot field, timeline), chart types and the closing question.
