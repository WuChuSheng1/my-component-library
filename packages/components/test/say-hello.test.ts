import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import StSayHello from "../src/say-hello/SayHello.vue";

describe("StSayHello", () => {
  it("renders button and reacts to click", async () => {
    const wrapper = mount(StSayHello, { props: { name: "world" } });
    const btn = wrapper.find("button");
    expect(btn.exists()).toBe(true);
    await btn.trigger("click");
  });
});
