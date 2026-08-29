# Vendored fonts

Used only by `scripts/generate-post-thumbnail.mjs`, which draws a card for a post
that has no image of its own. Never served to the browser — the site loads these
same faces through `next/font` instead.

They are here because satori embeds text as vector paths, and needs the font
file to do it. Committed rather than fetched at generation time so the output
does not depend on the network, and so a thumbnail regenerated in a year looks
like one generated today.

Both are **static instances**, not the variable fonts. satori's OpenType parser
trips over a `wght` axis; the Google Fonts API serves a static cut when the
request carries no User-Agent:

```bash
curl -sL "$(curl -s 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700' \
  | grep -oE 'url\((https://[^)]+)\)' | sed 's/url(//;s/)//')" -o SpaceGrotesk.ttf

curl -sL "$(curl -s 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500' \
  | grep -oE 'url\((https://[^)]+)\)' | sed 's/url(//;s/)//')" -o JetBrainsMono.ttf
```

Send a browser User-Agent and you get WOFF2, which satori cannot read; send an
old MSIE one and you get EOT, which it cannot read either.

Licensed under the SIL Open Font License — see `OFL.txt`.
