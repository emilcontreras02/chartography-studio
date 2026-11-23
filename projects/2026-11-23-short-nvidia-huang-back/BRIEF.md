# Short: "Nvidia's CEO is back" (Chartography, test run on Emil's Mac, Nov 23, 2026)

Rules come from the Chartography Content Hub (Google Sheet "Chartography – Content Hub", Brand Guide tab). This brief is the copy for this video.

## Goal
Make a 9:16 YouTube Short (1080x1920, 30 fps, about 46 s) in Remotion and save it as `out/nvidia-huang-back.mp4`.
This is a TEST of the Mac setup: do NOT upload or publish anything.

## Already done for you
- Voiceover: `public/vo.mp3` (45.3 s; free Chartography voice, 0 ElevenLabs credits). Don't re-voice.
- `src/timing.json`: `seg` = start second of each script line, `cues` = the second each key word is spoken, `caps` = word-by-word captions (word, start, end, speaker, highlight).
- `src/Root.tsx` = the Thanksgiving Short (our approved Shorts template). Keep its Background, Hero (mascot sprites in public/sprites), Pop/Fade, Brand, Captions and Source components. Rewrite the scenes for this story. Composition id: `NvidiaShort`.
- Skills installed: use GSAP-style easing/timing ideas (spring/interpolate), and the Humanizer rules for any on-screen text.

## Script (already voiced; hero = our mascot, narr = narrator)
1. hero (0.0 s): Nvidia's stock jumped about thirty percent in one morning. Why? Its CEO is back.
2. narr (5.7 s): On November twelfth, Jensen Huang resigned as Nvidia's CEO. The company's filing gave no reason. The CFO, Colette Kress, stepped in as interim CEO.
3. narr (16.8 s): Then the stock fell seven trading days in a row.
4. hero (19.7 s): Eleven days later... plot twist.
5. narr (22.7 s): This morning, the board voted unanimously to bring him back, effective immediately. At the opening bell, Nvidia jumped almost thirty-two percent, to about one sixty-five a share.
6. narr (34.7 s): An independent committee is still looking into reports that a foreign intelligence effort targeted him.
7. hero (40.7 s): Out for eleven days, then back on top. Right call? Tell me in the comments.

## Verified facts (the ONLY numbers allowed on screen)
- Nov 12, 2026: Jensen Huang resigned as President, CEO and board member, effective immediately; no reason given; CFO Colette Kress named interim CEO; Harvey C. Jones named first-ever Board Chair. Source: Nvidia 8-K press release, https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000082/nvidiaannouncesceotransiti.htm
- Nov 23, 2026: board UNANIMOUSLY reinstated Huang as President, CEO and director, effective immediately; Kress returns to CFO only; independent-director committee keeps investigating reports of a foreign intelligence effort targeting Huang; new National Security and Export Control Committee. Source: Nvidia 8-K press release, https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000090/nov23pressrelease.htm
- 11 days between resignation and return (Nov 12 -> Nov 23).
- Stock: 7-day losing streak before the reinstatement; at the open on Nov 23 (9:30 AM ET) NVDA was up 31.93% at $165.61 (+$40.08, so the prior close was $125.53). Source: Yahoo Finance live blog, Nov 23, 2026. Show "as of the opening bell, Nov 23".
- Do NOT mention the reasons reported in the press for his resignation (personal-conduct reports): the filing gave none, and we stick to the filings.

## Scenes (suggested, use the cues)
1. HOOK (0-5.7 s): on-screen at 0.0 s: "NVIDIA +30%" big mint number + "IN ONE MORNING"; at cue `back` a stamp "THE CEO IS BACK". Mascot shocked.
2. TIMELINE (5.7-19.7 s): a calendar strip Nov 12 -> Nov 23. At `nov12` a simple round-head caricature labeled "Jensen Huang" (loose: black hair, black leather jacket - 2-3 traits only, no realistic face) walks out a door marked "CEO"; at `noreason` a document card "8-K filing: reason - none given"; at `kress` a second round-head character labeled "Colette Kress, interim CEO" steps in. At `fell7` seven red down-candles in a row (coral #FF8A65 / red) labeled "7 straight down days".
3. TWIST (19.7-22.7 s): mascot big, jaw drop, "11 DAYS LATER..." with a calendar flipping.
4. RETURN (22.7-34.7 s): at `unanimous` a board table with 11 round-head silhouettes all raising hands, "UNANIMOUS"; Huang character walks back in. At `bell` a bell rings; at `pct32` a huge mint "+31.93%" counter; at `p165` "$125.53 -> $165.61" price tag, small "at the open, Nov 23".
5. STILL OPEN (34.7-40.7 s): a folder stamped "INVESTIGATION ONGOING" with a magnifier; label "independent committee".
6. CTA (40.7-46.9 s): "RIGHT CALL?" + comment button; mascot pointing; then end card "More money stories on the channel".
- Source line (bottom, every scene): "Sources: Nvidia 8-K filings (Nov 12 & Nov 23, 2026); Yahoo Finance (price at the open, Nov 23)".
- NO photos of real people, NO Nvidia logo or any brand logo (write "NVIDIA" as plain text), no music.

## Brand (Content Hub)
Navy #0E1B2E background, cream #F6F1E7 text, mint #3FD6A0 main numbers, amber #F2B544 highlights, coral #FF8A65 losses, slate #5C7392 secondary. Chartography brand at the top, captions in the lower third (keep the template's caption position), mascot = full-body sprites only (never redraw him). Payoff number on screen within 2 s. Nothing cut off or overlapping inside x 60-1020, y 250-1700.

## Checks before the full render
1. `npm ci --ignore-scripts` (first time only).
2. Render 5 stills (`npx remotion still src/index.ts NvidiaShort out/s1.png --frame=<n>`) at 1 s, 12 s, 21 s, 31 s, 43 s and look at each: no overlaps, nothing cut off, numbers match the facts above.
3. Full render: `npx remotion render src/index.ts NvidiaShort out/nvidia-huang-back.mp4 --crf=18`
4. `ffprobe` it: about 46-47 s, 1080x1920, audio present. Then say "DONE" and the file path.
