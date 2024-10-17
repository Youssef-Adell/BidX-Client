// Plugins
import router from "@/router";
import vuetify from "./vuetify";
import { createPinia } from "pinia";

export function registerPlugins(app) {
  app.use(vuetify);
  app.use(router);
  app.use(createPinia());
}
