"""Extra reveal cues for the Remotion build (phrases as the transcriber heard them), in script order."""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
import chartography_engine as ce
H = os.path.dirname(os.path.abspath(__file__))
P = [
 ('h_ten', 'here are the ten biggest'),
 ('e10_val', 'sixteen and a half billion dollars'), ('e10_rule', 'one rule for this whole list'), ('e10_fifth', 'only about a fifth'),
 ('e9_val', 'seventeen point eight billion'), ('e9_gap', 'more than one billion dollars above'), ('e9_years', 'top ten spot for sixteen years'),
 ('e8_val', 'seventeen point nine billion'), ('e8_gap', 'just forty eight million'),
 ('e7_val', 'eighteen point one billion'), ('e7_old', 'the oldest deal on this list'), ('e7_28', 'twenty eight years later'),
 ('e6_val', 'twenty one point three billion'), ('e6_two', 'so two of the ten biggest'),
 ('e5_val', 'twenty one point eight billion'), ('e5_gap', 'four hundred twenty million more'), ('e5_rec', 'it was the biggest i p o ever'),
 ('e4_val', 'twenty five point six billion'), ('e4_gap', 'three point eight billion more'), ('e4_rec', 'a new world record'), ('e4_65', 'lasted a long time six and a half years'),
 ('e3_val', 'twenty six and a half billion'), ('e3_gap', 'nine hundred million more'), ('e3_crown', 'would have taken the crown'), ('e3_year', 'numbers three two and one all happened'),
 ('e2_shares', 'five hundred fifty five point six million shares'), ('e2_price', 'one hundred thirty five dollars each'), ('e2_val', 'seventy five billion dollars'),
 ('e2_3x', 'nearly three times the old record'), ('e2_day', 'on its first day'), ('e2_19', 'up nineteen per cent'),
 ('e1_shares', 'nine hundred eighty million shares'), ('e1_price', 'eighty three dollars each'), ('e1_range', 'seventy to seventy eight dollar range'),
 ('e1_val', 'about eighty one point three billion dollars'), ('e1_more', 'six point three billion more'), ('e1_tril', 'one point five trillion'),
 ('e1_priv', 'last private valuation'), ('e1_combo', 'it raised more than numbers three four and five'), ('e1_ticker', 'under the ticker'),
 ('tw_quarter', 'less than a quarter of'), ('tw_visa', 'two thousand eight hundred fifty four'), ('tw_aramco', 'down about thirteen per cent'),
 ('tw_fb', 'fell off this list'), ('tw_fb47', 'lost forty seven per cent'), ('tw_fb1572', 'one thousand five hundred seventy two'), ('tw_end', 'loudest day'),
 ('rc_top2', 'together the top too raised'), ('rc_other', 'the other eight combined'),
]
if __name__ == '__main__':
    words = json.load(open(H + '/words.json')); dur = ce.duration(H + '/vo.mp3')
    c = ce.Cues(words, dur)
    out = {}
    for k, p in P:
        out[k] = round(c.at(p), 3)
    tp = H + '/remotion/src/timing.json'
    t = json.load(open(tp)); t['x'] = out; json.dump(t, open(tp, 'w'), indent=1)
    print(ce.sync_report(c, H + '/sync.json'))
    print(out)
