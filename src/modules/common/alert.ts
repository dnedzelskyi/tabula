const CONSTANTS = {
  SHOW_INTERVAL: 2000,
};

let processId: number = 0;
let alertElement: HTMLElement | null = null;
const alertsQueue: string[] = [];

export function initAlert(moduleElementId: string): void {
  const moduleElement = document.getElementById(moduleElementId);

  if (!moduleElement) {
    console.error(
      `Unable to initialize "Alert Module".
      UI module element with Id: ${moduleElementId} does not exist.`
    );
    return;
  }

  moduleElement.innerText = '';
  alertElement = moduleElement;
}

export const Alert = {
  send(message: string): void {
    if (!alertElement) {
      console.error('Error. Placeholder for alerts is not defined.');
      return;
    }

    // Add message to alert queue.
    alertsQueue.push(message);

    // Skip processing if it's already running.
    if (processId) {
      return;
    }

    processId = process(alertElement);
  },
};

function process(alertElement: HTMLElement): number {
  const message = alertsQueue.shift();

  // No more alerts to display.
  if (!message?.length) {
    processId = 0;
    alertElement.innerText = '';

    return 0;
  }

  // Show message for some period of time.
  alertElement.innerText = message;

  // Process next.
  return window.setTimeout(
    () => process(alertElement),
    CONSTANTS.SHOW_INTERVAL
  );
}
