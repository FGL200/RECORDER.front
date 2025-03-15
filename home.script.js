import { Helper } from "./main.script.js";

const columns = [];

(async () => {
  const env = Helper.getEnvironment(Helper.isProduction());

  Helper.getById("nav-logout").addEventListener("click", () => {
    Helper.storage.clear();
    Helper.goto("./login.html");
  });

  Helper.getById("new-record-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const data = Helper.getDataFromForm("new-record-form");

    console.log({ data })

    if (Helper.getInvalids("new-record-form")) {
      Helper.getById("prompt-error").classList.remove("d-none");
      return;
    }
    Helper.getById("prompt-error").classList.add("d-none");

    Helper.waitHandler.newRequest();

    setTimeout(() => {
      Helper.waitHandler.finishRequest();
      this.reset();
      columns.forEach(column => column.remove());
      columns.splice(0, columns.length);

      Helper.getById("prompt-success").classList.remove("d-none");
      setTimeout(() => {
        Helper.getById("prompt-success").classList.add("d-none");
      }, 2000);

    }, 2000);
  });

  Helper.getById("button-add-column").addEventListener("click", () => {
    const column = Helper.getById("column-template").cloneNode(true);
    column.id = "";
    column.classList.remove("d-none");

    const input = column.querySelector("input");
    input.id = `column_input_${columns.length}`;
    input.name = "columnName[]";
    input.classList.remove("ignore-required");

    const label = column.querySelector("label");
    label.htmlFor = `column_input_${columns.length}`;

    const button = column.querySelector("button");
    button.addEventListener("click", () => column.remove());

    Helper.getById("columns-holder").appendChild(column);
    columns.push(column);
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