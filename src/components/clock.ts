export default class ClockComponent extends HTMLElement {
  private state: { timerId: number } = { timerId: -1 };
  private root: ShadowRoot;

  public static get tagName(): string {
    return 'tabula-clock';
  }

  public static register() {
    if (!customElements.get('ClockComponent')) {
      customElements.define(ClockComponent.tagName, ClockComponent);
    }
  }

  private static createHTML(dateText: string): string {
    return `
      <style>
        span {
          color: var(--secondary-text-color, inherit);
          font-size: 0.9em;
          padding: 8px;
        }
      </style>
      <span>${dateText}</span>
    `;
  }

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'closed' });
  }

  connectedCallback() {
    const timerId = window.setInterval(this.render.bind(this), 1000);
    this.state = { ...this.state, timerId };
  }

  disconnectedCallback() {
    window.clearInterval(this.state.timerId);
    this.state = { ...this.state, timerId: -1 };
  }

  render() {
    const dateText = this.parseDate(new Date());
    const output = this.root.querySelector('span');

    if (output) {
      output.innerHTML = dateText;
    } else {
      this.root.innerHTML = ClockComponent.createHTML(dateText);
    }
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
}
