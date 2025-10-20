import type { App } from "vue";
export * from "@my-wcs/components";
import Components from "@my-wcs/components";

export default {
  install(app: App) {
    app.use(Components);
  },
};
