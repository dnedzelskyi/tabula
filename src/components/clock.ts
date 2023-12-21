type State = { timerId: number };

const CONSTANTS = {
  TAG: 'tabula-clock',
};

export default class ClockComponent extends HTMLElement {
  private state: State = { timerId: 0 };
  private root: ShadowRoot;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'closed' });
  }

  public static get tagName(): string {
    return CONSTANTS.TAG;
  }

  connectedCallback() {
    this.render();
    const timerId = window.setInterval(this.render.bind(this), 1000);
    this.state = { ...this.state, timerId };
  }

  disconnectedCallback() {
    window.clearInterval(this.state.timerId);
    this.state = { ...this.state, timerId: 0 };
  }

  private render() {
    if (!this.root.hasChildNodes()) {
      this.root.innerHTML = ClockComponent.createHTML();
    }

    const dateText = this.parseDate(new Date());
    const output = this.root.querySelector('#clock')!;

    output.innerHTML = dateText;
  }

  private parseDate(value: Date): string {
    const date = value.toLocaleDateString();
    const period = value.getHours() < 12 ? 'AM' : 'PM';
    const time = value.toLocaleTimeString('en-US', {
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });

    return `${date} ${time} ${period}`;
  }

  public static register() {
    if (!customElements.get(ClockComponent.tagName)) {
      customElements.define(ClockComponent.tagName, ClockComponent);
    }
  }

  private static createHTML(): string {
    return `
      <style>
        span {
          color: var(--secondary-text-color, inherit);
          font-size: 0.9em;
          padding: 8px;
        }
      </style>
      <span id="clock"></span>
    `;
  }
}
