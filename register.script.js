import { Helper } from "./main.script.js";

(async () => {
  const env = Helper.getEnvironment(Helper.isProduction());

  Helper.getById("login-button").addEventListener("click", () => Helper.goto("./login.html"));

  Helper.getById("register-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const data = Helper.getDataFromForm("register-form");

    if (Helper.getInvalids("register-form")) {
      Helper.getById("prompt-error").classList.remove("d-none");
      return;
    }
    Helper.getById("prompt-error").classList.add("d-none");

    Helper.storage.set("username", data.username);
    Helper.waitHandler.newRequest();

    setTimeout(() => {
      Helper.waitHandler.finishRequest();
      Helper.goto("./login.html");
    }, 2000);
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