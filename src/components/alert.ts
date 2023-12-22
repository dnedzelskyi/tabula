type State = {
  alertsQueue: string[];
  broadcastProcessId: number;
  broadcastTimeout: number;
};

const CONSTANTS = {
  TAG: 'tabula-alert',
  ATTRIBUTES: ['timeout'],
  DEFAULT_TIMEOUT: 2000,
};

export default class AlertComponent extends HTMLElement {
  private root: ShadowRoot;
  private state: State = {
    alertsQueue: [],
    broadcastProcessId: 0,
    broadcastTimeout: CONSTANTS.DEFAULT_TIMEOUT,
  };

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'closed' });
  }

  static get tagName(): string {
    return CONSTANTS.TAG;
  }
  static get observedAttributes() {
    return Object.freeze(CONSTANTS.ATTRIBUTES);
  }

  broadcast(message: string) {
    if (message.length === 0) {
      return;
    }

    // Add message to alert queue.
    this.state = {
      ...this.state,
      alertsQueue: [...this.state.alertsQueue, message],
    };

    // Skip processing if it's already running.
    if (this.state.broadcastProcessId > 0) {
      return;
    }

    this.render();
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this.state.broadcastProcessId > 0) {
      window.clearTimeout(this.state.broadcastProcessId);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    switch (name) {
      case 'timeout':
        this.state = {
          ...this.state,
          broadcastTimeout: Number.parseInt(newValue),
        };
        break;
      default:
        throw new Error(
          `Invalid attribute ${name} for <${AlertComponent.tagName}> element.`
        );
    }
  }

  private render() {
    if (!this.root.hasChildNodes()) {
      this.root.innerHTML = AlertComponent.createHTML();
    }

    const output = this.root.querySelector('#alert')!;
    const message = this.state.alertsQueue[0];

    // Remove message from queue.
    this.state = {
      ...this.state,
      alertsQueue: [...this.state.alertsQueue.slice(1)],
    };

    // No more alerts to display.
    if (!message?.length) {
      this.state = { ...this.state, broadcastProcessId: 0 };
      output.innerHTML = '';

      return;
    }

    // Show message for some period of time.
    output.innerHTML = message;

    // Process next.
    const broadcastProcessId = window.setTimeout(
      this.render.bind(this),
      this.state.broadcastTimeout
    );
    this.state = { ...this.state, broadcastProcessId };
  }

  public static register() {
    if (!customElements.get(AlertComponent.tagName)) {
      customElements.define(AlertComponent.tagName, AlertComponent);
    }
  }

  private static createHTML(): string {
    return `
      <style>
        * {
          box-sizing: border-box;
        }
        code {
          color: var(--secondary-text-color, initial);
          font-size: 1.1em;
          padding: 8px;
        }
      </style>
      <code id="alert"></code>
    `;
  }
}
