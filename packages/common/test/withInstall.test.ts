import { describe, it, expect } from "vitest";
import { withInstall } from "../src/index";

const DummyComp = { name: "DummyComp", render() {} } as any;

describe("withInstall", () => {
  it("adds install and registers component", () => {
    const comp = withInstall(DummyComp);
    let registered: string | null = null;
    const app = {
      component: (n: string) => {
        registered = n;
      },
    } as any;
    comp.install(app);
    expect(registered).toBe("DummyComp");
  });
});
