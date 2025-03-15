export class Helper {

  static isProduction() {
    return true;
  }

  static getEnvironment(production = false) {
    if (production) return {
      API_URL: 'http://frecords.infinityfreeapp.com',
    }
    else return {
      API_URL: 'http://localhost/RECORDER.back',
    }
  }

  static getById(id = "") {
    return document.getElementById(id);
  }

  static getAllByClass(className = "") {
    return document.querySelectorAll(`.${className}`);
  }

  static getAllByTag(tagName = "") {
    return document.querySelectorAll(tagName);
  }

  static getChildById(parentId = "", childId = "") {
    return Helper.getById(parentId).querySelector(`#${childId}`);
  }

  static getAllChildByClass(parentId = "", childClass = "") {
    return Helper.getById(parentId).querySelectorAll(`.${childClass}`);
  }

  static goto(href = "") {
    window.location.href = href;
  }

  static storage = {
    set: (key = "", value) => key ? localStorage.setItem(key, JSON.stringify(value)) : console.error("Key is required"),
    get: (key = "") => key ? JSON.parse(localStorage.getItem(key)) : console.error("Key is required"),
    remove: (key = "") => key ? localStorage.removeItem(key) : console.error("Key is required"),
    clear: () => localStorage.clear(),
  }

  static waitHandler = {
    numberOfRequests: 0,
    newRequest: () => {
      Helper.waitHandler.numberOfRequests++;
      if (Helper.waitHandler._callbackOnNewRequest) Helper.waitHandler._callbackOnNewRequest();
    },
    finishRequest: () => {
      Helper.waitHandler.numberOfRequests--;
      if (Helper.waitHandler.numberOfRequests < 0) Helper.waitHandler.numberOfRequests = 0;
      if (Helper.waitHandler._callbackOnFinishedRequest) Helper.waitHandler._callbackOnFinishedRequest();
    },
    isProcessing: () => Helper.waitHandler.numberOfRequests > 0,
    setOnNewRequestCallback: (callback) => Helper.waitHandler._callbackOnNewRequest = callback,
    setOnFinishedRequestCallback: (callback) => Helper.waitHandler._callbackOnFinishedRequest = callback,
    _callbackOnNewRequest: null,
    _callbackOnFinishedRequest: null,

  }

  static getInvalids = (formId = "") => {
    if (!formId) return 0;

    const form = Helper.getById(formId);
    if (!form) return 0;

    let invalids = 0;
    form.querySelectorAll("*.required").forEach(input => {
      if (input.classList.contains("ignore-required")) return;
      invalids += input.value ? 0 : 1;
    });

    return invalids;
  }

  static bindValesToTemplate = (template = "", data = {}) => {
    let result = template;
    for (const key in data) {
      result = result.replaceAll(`{{${key}}}`, data[key]);
    }
    return result;
  }

  static getDataFromForm = (formId = "") => {
    const data = {};

    new FormData(Helper.getById(formId)).forEach((value, key) => {
      if (key.endsWith('[]')) {
        const arrayKey = key.slice(0, -2);
        if (!data[arrayKey]) {
          data[arrayKey] = [];
        }
        data[arrayKey].push(value);
      } else {
        data[key] = value;
      }
    });

    return data;
  }

  static getSearchParam(key = "") {
    return new URLSearchParams(window.location.search).get(key);
  }

  static apiRequest = async (url = "", method = "GET", data = {}) => {
    const fetchApi = method === 'GET' ?
      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      }) :
      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data).toString(),
      });

    return await fetchApi.then(async response => {
      if (!response.ok) {
        return response.text().then(text => JSON.parse(text));
      };

      return response.json();
    })
      .then(data => {
        if (data.error) console.error(data.error);
        return data;
      })
      .catch(error => {
        console.error('Fetch error:', error);
        return { error: Helper.errorMessages.serverError };
      });
  }

  static errorMessages = {
    required: "Please fill out required fields.",
    invalid: "Please check for invalid fields.",
    serverError: "Server error. Please try again later.",
  }

  static setPromtError(promt_id = "", message = "") {
    const promt = Helper.getById(promt_id);
    if (promt) {
      promt.textContent = message;
      promt.classList.remove("d-none");
      setTimeout(() => promt.classList.add("d-none"), 2000);
    }

  }

}