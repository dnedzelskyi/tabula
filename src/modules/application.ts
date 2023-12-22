/* eslint-disable @typescript-eslint/no-explicit-any */
type Class<T> = {
  new (...args: any[]): T;
};

type InjectableComponent = {
  register: () => void;
};

export default class App extends EventTarget {
  private static AppBuilder = class AppBuilder {
    private services = new Map<Class<any>, any>();

    registerComponents(components: InjectableComponent[]) {
      components.forEach((component) => component.register());
      return this;
    }

    registerService<T>(dependency: Class<T>, instance: T) {
      this.services.set(dependency, instance);
      return this;
    }

    create() {
      return new App(this.services);
    }
  };

  private constructor(private services: Map<Class<any>, any>) {
    super();
  }

  static get builder() {
    return new App.AppBuilder();
  }

  resolveService<T>(dependency: Class<T>): T | null {
    return this.services.get(dependency) ?? null;
  }
}
