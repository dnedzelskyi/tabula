import { WebComponentStaticMembers } from "./types/common";

type State = {
  placeholder: string;
  value: string;
};

const NoteComponent = class NoteComponent extends HTMLElement {
  private static CONSTANTS = {
    TAG: 'tabula-note',
    ATTRIBUTES: ['placeholder'],
  };

  private root: ShadowRoot;
  private state: State = {
    placeholder: '',
    value: '',
  };

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'closed' });
  }

  get value(): string {
    return this.textareaElement.value;
  }
  set value(newValue: string) {
    if (this.state.value === newValue) {
      return;
    }
    this.state = {
      ...this.state,
      value: newValue,
    };
    this.render();
  }

  private get textareaElement(): HTMLTextAreaElement {
    return this.root.querySelector('#note') as HTMLTextAreaElement;
  }

  static get tagName(): string {
    return NoteComponent.CONSTANTS.TAG;
  }
  static get observedAttributes() {
    return Object.freeze(NoteComponent.CONSTANTS.ATTRIBUTES);
  }

  connectedCallback() {
    this.render();
    this.textareaElement.addEventListener('input', () => this.handleInput());
  }

  disconnectedCallback() {
    this.textareaElement.removeEventListener('input', () => this.handleInput());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    switch (name) {
      case 'placeholder':
        this.state = {
          ...this.state,
          placeholder: newValue,
        };
        break;
      default:
        throw new Error(
          `Invalid attribute ${name} for <${NoteComponent.tagName}> element.`
        );
    }
  }

  private render() {
    if (!this.root.hasChildNodes()) {
      this.root.innerHTML = NoteComponent.createHTML();
    }

    this.textareaElement.placeholder = this.state.placeholder;
    this.textareaElement.value = this.state.value;
  }

  private handleInput() {
    this.dispatchEvent(
      new CustomEvent('input', {
        bubbles: true,
        composed: true,
        detail: {
          value: this.value,
        },
      })
    );
  }

  static register() {
    if (!customElements.get(NoteComponent.tagName)) {
      customElements.define(NoteComponent.tagName, NoteComponent);
    }
  }

  private static createHTML(): string {
    return `
      <style>
        * {
          box-sizing: border-box;
        }

        textarea {
          height: 80vh;
          width: 100%;
          padding: 16px;
          font-size: 1.5em;
          outline: none;
          border: 0;
          border-top: 2px dotted var(--secondary-color);
          border-bottom: 2px dotted var(--secondary-color);
          resize: none;
          color: var(--primary-text-color);
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: var(--secondary-color) var(--background-color);
        }

        *::-webkit-scrollbar {
          cursor: pointer;
          width: 16px;
          height: 4px;
        }

        *::-webkit-scrollbar-track {
          background: var(--background-color);
        }

        *::-webkit-scrollbar-thumb {
          background-color: var(--secondary-color);
          height: 8px;
          border-radius: 4px;
          border: 4px solid var(--background-color);
        }
      </style>
      <section>
        <textarea id="note"></textarea>
      </section>
    `;
  }
} satisfies WebComponentStaticMembers;

export default NoteComponent;