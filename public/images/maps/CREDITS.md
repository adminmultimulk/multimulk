# Map imagery

## istanbul.webp

Rendered from [OpenStreetMap](https://www.openstreetmap.org) tiles and
committed, rather than fetched when somebody opens a listing. Nothing on the
public site talks to a tile server.

| | |
|---|---|
| Source | `tile.openstreetmap.org`, zoom 11, 40 tiles stitched |
| Bounding box | 28.4°E, 40.75°N → 29.6°E, 41.35°N |
| Size | 1748 × 1159, aspect 1.5082 |
| Licence | [ODbL](https://www.openstreetmap.org/copyright) — commercial use permitted **with attribution** |

**The credit is a licence condition.** `© OpenStreetMap` is drawn in the corner
of the frame by `app/components/pinned-map.tsx`. Do not remove it, and if the
map is ever reused somewhere else, the credit goes with it.

## The bounding box and the picture are one artefact

`ISTANBUL` in `app/lib/mercator.ts` records the rectangle this image covers, and
the pin is placed by projecting a listing's coordinates into it. Replacing the
picture without updating that box — or vice versa — slides every pin off the
city, silently and on every listing at once. Change the two together.

The box was chosen to hold the districts Multi Mulk actually lists in:
Beylikdüzü and Büyükçekmece in the west, Kartal, Pendik and Tuzla in the east,
Sarıyer at the top of the Bosphorus. A listing outside it — anything Caribbean
or Bodrum, and also Silivri and Şile, which are genuinely İstanbul districts
but lie beyond the frame — projects to null and the section falls back to an
interactive embed rather than pinning the edge of the picture.

To re-render at a different box or zoom, the tiles must be fetched with a
User-Agent that identifies the site: OpenStreetMap's tile policy refuses
anonymous bulk downloads, and this is a one-off build step, never a runtime one.
