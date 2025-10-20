import type { App } from "vue";
import { withInstall } from "@my-wcs/common";
import StSayHello from "./say-hello/SayHello.vue";

export const MySayHello = withInstall(StSayHello, "StSayHello");

export { StSayHello };

export default {
  install(app: App) {
    app.component("StSayHello", StSayHello);
  },
};
