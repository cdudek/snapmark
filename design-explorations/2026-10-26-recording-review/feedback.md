# Round 1 feedback (owner, 2026-10-26)

**Pick: 03 Key frames.** "keyframes only, I guess we can strip away images based on the identical hash or something? also when playing it keeps the timing?"

- Frames that do not change are dropped; the key frames are the ones where the screen changed, plus the first and the settled last frame.
- The GIF keeps the real timing: a dropped frame's time is added to the frame before it.
