# Editorial imagery

Stock photography from [Pexels](https://www.pexels.com), used under the
[Pexels licence](https://www.pexels.com/license/): free for commercial use, no
attribution required. Credited here anyway — knowing where an asset came from
is the difference between replacing it confidently and guessing.

These are the *editorial* images: heroes, region tiles and section grounds.
Development photography is separate and stays as supplied.

## The brightness rule

Every hero frame carries white type — a headline, a standfirst and three
buttons — directly over it. A photograph that is bright where the text sits
does not merely look wrong; it makes the copy unreadable.

The measure that matters is average luminance across the band from 18% to 62%
of the image height, which is where the type lands. **Under ~75 is safe, over
~95 is not.** A 35% `forest-deep` wash sits over every slide, which brings a
reading of 65 down to about 50.

The first pass at this used flat-lit stock that measured 126 to 178 in that
band, and the outlined buttons vanished into it. That is what the numbers
below exist to prevent recurring.

| File | Pexels ID | Band | Subject |
|---|---|---|---|
| hero-dubai-night.jpg | 17914739 | 43 | Dubai at night — Burj Khalifa, the Sheikh Zayed interchange |
| hero-island-dusk.jpg | 1028546 | 64 | An island under a storm sky at golden hour |
| hero-island-lagoon.webp | supplied | 112 | Overwater bungalows on a turquoise lagoon — the one daylight frame, so it carries a 60% wash instead of 35% |
| hero-istanbul-dusk.jpg | 32838840 | 65 | İstanbul at dusk — the Bosphorus Bridge lit, city beyond |
| hero-istanbul.jpg | 27304992 | 74 | İstanbul from above — Galata, the Golden Horn, the historic peninsula |
| cbi-documents.jpg | 7841502 | 95 | A pen passed across a desk for signature |
| cbi-island.jpg | 19199117 | 106 | A Caribbean island from the air |
| hero-caribbean.jpg | 28055689 | 146 | Cabrits National Park, Dominica |
| cbi-advisory.jpg | 36733323 | 155 | A meeting in an office |
| cbi-caribbean-aerial.jpg | 11402368 | 67 | Islands in turquoise water, from the air |
| cbi-caribbean-bay.webp | supplied | 176 (label band) | A Caribbean bay from a flowering hillside — the region tile, which carries a 65% top gradient for its white label |
| cbi-istanbul-strait.jpg | 28601284 | 178 | İstanbul cityscape and the Bosphorus |
| hero-st-lucia-soufriere.jpg | Commons — see below | 89 | Soufrière and the Pitons at golden hour, St. Lucia |
| about-hero-earth-night.jpg | Unsplash — NASA | ~20 | Earth at night from orbit — the About hero. Global citizenship, not a resort and not a frame already used on a programme page |
| hero-passports.jpg | 29402986 | bright (left wash) | Passports on a map — the citizenship hub hero. The frame is the document, not one programme; the page already darkens the left for type |

## The one image here that is not Pexels

`hero-st-lucia-soufriere.jpg` is the first hero frame on the Caribbean
programme page, and it is the only file in this folder that carries an
attribution condition:

- **Source:** [Soufriere, St. Lucia Sunset.jpg](https://commons.wikimedia.org/wiki/File:Soufriere,_St._Lucia_Sunset.jpg)
  on Wikimedia Commons, from [Jim Vajda's original on Flickr](https://www.flickr.com/photos/jimvajda/53631332776/).
- **Licence:** CC BY 2.0. Unlike the Pexels licence, **this one requires
  attribution** — "Jim Vajda, CC BY 2.0" or equivalent, with a link.
  Recording it in this file is not enough on its own: the credit has to be
  reachable from the site. Until that line exists somewhere public, the page
  is using the image outside its licence.
- **Processing:** the Commons original is 12211×6869. Downscaled from the
  3840px rendition to 2400×1350 to match the other hero frames, at JPEG q82
  with 4:4:4 chroma. Re-derive from the source rather than upscaling this
  file if a larger version is ever needed.

An earlier pass used a supplied file named
`StLucia-2021-GettyImages-166565984-2`, which was both licensed stock and
only 1024×575 — soft on a full-bleed hero. This replaced it on both counts.

The four at the top are the hero rotation. The bright ones below are used only
in sections that set their own ground — a region tile with its own overlay, or
a block on white — never under white type.

`hero-caribbean.jpg` is Cabrits National Park in Dominica, the headland where
Port Cabrits Marina and InterContinental Dominica Cabrits stand. It is the one
frame here showing a place we actually work in rather than a stand-in.

## The passport grounds

The two benefits sections sit on the passport each programme actually issues.
These are not from Pexels — no free-licence photograph of a Caribbean passport
exists — so both come from [Wikimedia Commons](https://commons.wikimedia.org),
and both are public domain dedications with no attribution required, credited
here on the same principle as everything else.

| File | Commons source | Band | Subject |
|---|---|---|---|
| cbi-passport-caribbean.jpg | [Saint Lucian Passport.jpg](https://commons.wikimedia.org/wiki/File:Saint_Lucian_Passport.jpg) (CC0) | 53 | A Caribbean Community cover, cropped to the embossed coat of arms |
| cbi-passport-turkiye.jpg | [Turkish passport detail.jpg](https://commons.wikimedia.org/wiki/File:Turkish_passport_detail.jpg) (public domain) | 134 | The crescent and star on a Turkish passport page, in macro |

Both run *washed* — they are grounds, sensed rather than read — which is why
the band figures matter and the source resolution does not have to carry
lettering.

## The destinations panel

The homepage destinations panel used to run a passport crop unwashed, in the
same family as the grounds above. It now runs client-supplied collage artwork
instead — a passport held over a landmark, cut out on transparency:

| File | Region | Source | Size |
|---|---|---|---|
| cbi-passport-turkiye-collage.webp | Türkiye | Supplied by the client (`cover1-1-1-1.png`) | 986x1335 |
| cbi-passport-caribbean-collage.webp | Caribbean | Supplied by the client (`banner_img.png`) | 1126x1126 |

Two things follow from these being cutouts rather than photographs. The panel
runs them `object-contain` on the section's mist ground, not `object-cover` —
a cover crop would cut the passport out of the composition — and its mobile
frame is square rather than 700/560, because the Türkiye piece is portrait and
a landscape frame letterboxed it heavily. They are WebP with alpha (`cwebp -q
88 -alpha_q 100 -m 6`); anything replacing them needs a transparent background
or the mist ground will show a white rectangle behind the art.

The Caribbean piece is an Antigua and Barbuda cover. Antigua is a CARICOM
member, so "CARIBBEAN COMMUNITY" above the arms carries the region — which is
what a panel covering several islands needs, and the same reason the earlier
crops in this folder were framed above the country name rather than on it.

The band figures are recorded for consistency, not as a constraint: the two
washed files sit under an 88% wash rather than a hero's 35%, so only about a
tenth of the image reaches the page and no type is at risk. What matters
instead is that the country is the right one. The slot previously held a Pexels
shot of European passports (ID 29402986), which put a Portuguese cover behind
copy about Caribbean citizenship.

Source resolution is the constraint on this pair, because a full-bleed band
magnifies a passport cover several times over and a soft one reads as a
mistake. The first attempt used the only Dominica cover on Commons, at 438x640,
and it visibly smeared. The Saint Lucia file is 1024x1504, cropped here to the
cover and upscaled to 1500px wide, which holds at 2x. It is framed on the
emblem rather than the lettering, so it reads as a Caribbean Community ground
for a page covering five islands rather than as one country's document.

## The share-alike file

There is no longer one. `cbi-passport-stkitts.jpg` held the destinations panel
under CC BY-SA 4.0 — attribution *and* share-alike, the crop being a derivative
work — until the panel moved to the client collages above. The file has been
deleted along with its row on `/legal/image-credits`; re-derive from
[A8fef01cb.jpg](https://commons.wikimedia.org/wiki/File:A8fef01cb.jpg) by
**Abhaybrar7** if it is ever wanted back, and restore the row with it.

`/legal/image-credits` still carries one obligation — the Saint Lucia hero,
CC BY 2.0 — so the page stays. Adding a share-alike file adds a row and the
share-alike flag in `app/lib/credits.ts` with it.

## Replacing one

Drop a file of the same name in and rebuild. Check the band first:

```sh
python3 - <<'PY'
from PIL import Image, ImageStat
im = Image.open("public/images/cbi/YOUR-FILE.jpg").convert("L")
w, h = im.size
print(ImageStat.Stat(im.crop((0, int(h*0.18), w, int(h*0.62)))).mean[0])
PY
```

Paths are referenced from `app/lib/content.ts` and `app/lib/citizenship.ts`.
