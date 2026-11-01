# Learn path assets

`public/assets/learn/piece_*.webp` and `cap.webp` are rendered here with three.js (our own geometry, no third-party art).

```
cd scripts/learn-assets && npm i --no-save three@0.169.0
KINDS=pawn,rook,bishop,knight,queen,king,cap node shoot.cjs . ./out "&c=%23959593&exp=0.9&env=0.6&k=3"
```
Then crop to the alpha bounding box and save as webp (pieces 240px tall, cap 240px wide). Needs Playwright's Chromium.
