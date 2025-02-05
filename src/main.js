// Plugins
import vue3GoogleLogin from "vue3-google-login";
import vuetify from "@/vuetify";
import pinia from "@/stores";
import router from "@/router";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

const app = createApp(App);

app.use(vue3GoogleLogin, {
  clientId:
    "163040209740-tu1mqt4d5anad2l9uco7pf27ghn1rul6.apps.googleusercontent.com",
  idConfiguration: {
    use_fedcm_for_prompt: true, //https://developers.google.com/identity/gsi/web/guides/overview#federated_credential_manager_fedcm
  },
  buttonConfig: {
    theme: "outline",
    text: "continue_with",
    width: "260",
    size: "large",
    locale: "en_US",
  }
});
app.use(vuetify);
app.use(pinia);
app.use(router);

app.mount("#app");
