import { WebComponentStaticMembers } from "./types/common";

type State = { timerId: number };

const ClockComponent = class ClockComponent extends HTMLElement {
  private static CONSTANTS = {
    TAG: 'tabula-clock',
  };

  private state: State = { timerId: 0 };
  private root: ShadowRoot;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'closed' });
  }

  static get tagName(): string {
    return ClockComponent.CONSTANTS.TAG;
  }

  connectedCallback() {
    this.render();
    const timerId = window.setInterval(
      () => this.render(),
      1000
    );
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

  static register() {
    if (!customElements.get(ClockComponent.tagName)) {
      customElements.define(ClockComponent.tagName, ClockComponent);
    }
  }

  private static createHTML(): string {
    return `
      <style>
        * {
          box-sizing: border-box;
        }
        span {
          color: var(--secondary-text-color, inherit);
          font-size: 0.9em;
          padding: 8px;
        }
      </style>
      <span id="clock"></span>
    `;
  }
} satisfies WebComponentStaticMembers;


export default ClockComponent;