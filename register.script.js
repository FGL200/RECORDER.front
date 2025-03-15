import { Helper } from "./main.script.js";

(async () => {
  const env = Helper.getEnvironment(Helper.isProduction());

  if (Helper.storage.get("email")) Helper.goto("./home.html");

  Helper.getById("login-button").addEventListener("click", () => Helper.goto("./login.html"));

  Helper.getById("register-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const data = Helper.getDataFromForm("register-form");

    if (Helper.getInvalids("register-form")) {
      Helper.getById("prompt-error").classList.remove("d-none");
      return;
    }
    Helper.getById("prompt-error").classList.add("d-none");

    Helper.waitHandler.newRequest();
    const response = await Helper.apiRequest(`${env.API_URL}/register/user`, 'POST', data).finally(() => Helper.waitHandler.finishRequest());
    Helper.waitHandler.finishRequest();

    if (response.error) {
      Helper.setPromtError("prompt-error", response.error);
    } else {
      Helper.storage.set("newlyRegistered", true);
      Helper.goto("./login.html");
    }
  });

  Helper.waitHandler.setOnNewRequestCallback(() => {
    Helper.getAllByTag("button").forEach(btn => btn.disabled = true);
    Helper.getAllByTag("a").forEach(a => a.classList.add("disabled"));
    Helper.getById("loading-icon").classList.add("spinner-border");
  });

  Helper.waitHandler.setOnFinishedRequestCallback(() => {
    Helper.getAllByTag("button").forEach(btn => btn.disabled = false);
    Helper.getAllByTag("a").forEach(a => a.classList.remove("disabled"));
    Helper.getById("loading-icon").classList.remove("spinner-border");
  });

})();