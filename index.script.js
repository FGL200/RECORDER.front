import { Helper } from "./main.script.js";

(async () => {
  const env = Helper.getEnvironment(Helper.isProduction());

  Helper.getById("login-button").addEventListener("click", () => Helper.goto("./login.html"));
})();