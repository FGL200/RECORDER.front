import { Helper } from "./main.script.js";

(async () => {
  const env = Helper.getEnvironment(Helper.isProduction());

  if (Helper.storage.get("email")) Helper.goto("./home.html");

  Helper.getById("login-button").addEventListener("click", () => Helper.goto("./login.html"));
})();