export function drawWaveform(
  waveData: number[][],
  canvas: HTMLCanvasElement,
  color: string
) {
  const context = canvas.getContext('2d');
  if (!context) return;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // mirror
  context.fillStyle = color;
  context.globalAlpha = 0.5;
  waveData.forEach(lineData => {
    const height = (55 / 100) * lineData[3];
    context.fillRect(
      lineData[0],
      lineData[1] + lineData[3] + 1,
      lineData[2],
      height
    );
  });

  // main
  context.fillStyle = color;
  context.globalAlpha = 1;
  waveData.forEach(lineData => {
    context.fillRect(lineData[0], lineData[1], lineData[2], lineData[3]);
  });
}
