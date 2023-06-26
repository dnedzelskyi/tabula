const CONSTANTS = {
  TOAST_ELEMENT_ID: 'toast',
  TOAST_INTERVAL: 3000,
};

export const Notification = {
  send(message: string): void {
    const toastElement = document.getElementById(CONSTANTS.TOAST_ELEMENT_ID);

    if (!toastElement) {
      console.error('Unable to show notification message.');
      return;
    }

    // Show notification.
    toastElement.className = 'show';
    toastElement.innerText = message;

    // Hide notification after some interval.
    setTimeout(function () {
      toastElement.className = toastElement.className.replace('show', '');
      toastElement.innerText = '';
    }, CONSTANTS.TOAST_INTERVAL);
  },
};
