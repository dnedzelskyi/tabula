export function initClock(outputElementId: string): void {
  const output = document.getElementById(outputElementId);
  if (!output) {
    return;
  }

  const date = new Date();

  const dateText = date.toLocaleDateString();
  const timeText = date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  output.innerText = `${dateText} ${timeText} ${
    date.getHours() < 12 ? 'AM' : 'PM'
  }`;

  setTimeout(function () {
    initClock(outputElementId);
  }, 1000);
}
