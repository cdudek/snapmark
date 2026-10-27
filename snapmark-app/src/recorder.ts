// Renderer script for recorder.html (classic script, like scroll.ts): the hidden page Record grabs its frames in. It
// plays the display (desktopCapturer's source, through getUserMedia), draws the area onto a canvas at the chosen
// frame rate and hands each frame to main as a PNG at once, which writes it to a file, so a 30 s recording is never
// held in memory (plan, Risks). The query gives the source, the area and the display in points, and the frame rate.
(() => {
  const q = new URLSearchParams(location.search);
  const [x, y, w, h, bw, bh, fps] = ['x', 'y', 'w', 'h', 'bw', 'bh', 'fps'].map((k) => Number(q.get(k)));
  const source = q.get('source') ?? '';
  const fail = (e: unknown) => window.snapmark.recorderFailed(e instanceof Error ? e.message || e.name : String(e));

  // The smoke test's source: a test pattern at 2x, as a Retina display gives it, whose colour changes 30 times a
  // second, so no test ever records the owner's screen and every frame differs from the one before.
  const pattern = () => {
    const c = document.createElement('canvas');
    [c.width, c.height] = [bw * 2, bh * 2];
    const g = c.getContext('2d')!;
    let n = 0;
    const paint = () => {
      g.fillStyle = `hsl(${(n++ * 7) % 360} 80% 50%)`;
      g.fillRect(0, 0, c.width, c.height);
    };
    paint();
    setInterval(paint, 1000 / 30);
    return c.captureStream(30);
  };

  const run = async () => {
    const stream =
      source === 'test'
        ? pattern()
        : await navigator.mediaDevices.getUserMedia({
            audio: false,
            // Electron's desktop source; the standard constraints have no field for it
            video: { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: source } },
          } as unknown as MediaStreamConstraints);
    const [track] = stream.getVideoTracks();
    track.onended = () => fail(new Error('the screen stopped sending frames'));
    const video = document.querySelector('video')!;
    video.srcObject = stream;
    await video.play();
    const k = video.videoWidth / bw; // video pixels per point: 2 on a Retina display
    const canvas = document.createElement('canvas');
    [canvas.width, canvas.height] = [Math.round(w * k), Math.round(h * k)];
    const g = canvas.getContext('2d')!;
    const start = performance.now();
    // Each frame on the frame rate's clock; one that took too long to encode moves the next on, never two at once
    for (let next = start; ;) {
      const wait = next - performance.now();
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      const t = performance.now() - start;
      g.drawImage(video, x * k, y * k, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
      const png = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
      if (!png) throw new Error('a frame could not be encoded');
      window.snapmark.recorderFrame(t, new Uint8Array(await png.arrayBuffer()));
      next = Math.max(next + 1000 / fps, performance.now());
    }
  };
  run().catch(fail);
})();
