# Flags

National flags of the countries whose citizenship programmes the site covers,
used on the Citizenship mega menu cards.

SVGs from [flag-icons](https://github.com/lipis/flag-icons) (MIT), 4:3 ratio.
The flag designs themselves are public domain.

Türkiye is a photograph of the flag rather than the flat SVG, since its card
runs the full width of the menu row and the fabric gives it depth the vector
cannot. `tr.svg` stays for any use that needs the flat mark.

| File | Country |
|---|---|
| tr-waving.jpg | Türkiye (photograph, 1024×575) |
| tr.svg | Türkiye |
| gd.svg | Grenada |
| dm.svg | Dominica |
| kn.svg | St Kitts and Nevis |
| lc.svg | Saint Lucia |
| ag.svg | Antigua and Barbuda |

The `id` attributes inside each file are prefixed with the country code, so the
files stay safe to inline into one document should that ever be needed.

Paths are referenced from `app/lib/content.ts`.
