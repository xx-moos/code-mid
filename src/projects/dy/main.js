import "@babel/polyfill"; //(一定要在最上面，第一行)
import Es6Promise from "es6-promise";
Es6Promise.polyfill();
import "@/utils/rem"
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(router).mount("#app");
