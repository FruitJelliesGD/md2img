import { createApp } from "vue";
import App from "./App.vue";
import "highlight.js/styles/github.css";
import "./style.css";

const app = createApp(App);

app.config.errorHandler = (err) => {
  console.error("Global error:", err);
};

app.mount("#app");