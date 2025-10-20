import type { App, Component } from "vue";

export type InstallableComponent<C extends Component> = C & {
  install: (app: App) => void;
};

export function withInstall<C extends Component>(
  component: C,
  name?: string,
): InstallableComponent<C> {
  const installable = component as InstallableComponent<C> & { name?: string };
  installable.install = (app: App) => {
    const compName = name ?? installable.name;
    if (compName) app.component(compName, installable as unknown as Component);
  };
  return installable as InstallableComponent<C>;
}

export function noop(): void {}
