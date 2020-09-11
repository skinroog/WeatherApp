// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/weather.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWeather = getWeather;

async function getWeather(lat, lon) {
  const apiKey = '1dc9df05c4bbc873836c0d64a425d21d';
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=ru`);
  if (!response.ok) throw new Error(response.status);
  const weatherResults = await response.json();
  return filterWeatherResults(weatherResults);
}

function filterWeatherResults(results) {
  return {
    temperature: results.main.temp,
    feelsLike: results.main.feels_like,
    description: results.weather[0].description,
    wind: results.wind.speed,
    humidity: results.main.humidity,
    pressure: results.main.pressure,
    clouds: results.clouds.all,
    icon: results.weather[0].icon
  };
}
},{}],"js/display.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayWeather = displayWeather;
exports.addWarning = addWarning;
exports.togglePreloader = togglePreloader;

async function displayWeather(weather, address) {
  clearSearchValue();
  const place = document.querySelector('.app__location');
  const temperature = document.querySelector('.weather-main__temp-value');
  const description = document.querySelector('.weather-main__desc');
  const feelsLike = document.querySelector('.weather-main__feels-like-value');
  const wind = document.querySelector('[data-wind-value]');
  const humidity = document.querySelector('[data-humidity-value]');
  const pressure = document.querySelector('[data-pressure-value]');
  const clouds = document.querySelector('[data-clouds-value]');
  initChangeUnitsListener(temperature, feelsLike);
  place.textContent = address;
  temperature.textContent = formatTemperature(weather.temperature);
  feelsLike.textContent = formatTemperature(weather.feelsLike);
  description.textContent = weather.description;
  wind.textContent = weather.wind.toFixed(1) + ' м/с';
  humidity.textContent = Math.round(weather.humidity) + ' %';
  pressure.textContent = changePressureUnits(weather.pressure) + ' мм рт. ст.';
  clouds.textContent = Math.round(weather.clouds) + ' %';

  function clearSearchValue() {
    const inputSearch = document.querySelector('[data-search-input]');
    inputSearch.value = '';
    inputSearch.blur();
  }

  function changePressureUnits(value) {
    return Math.round(value * 0.75006375541921);
  }

  const icon = document.querySelector('.weather-main__icon');
  icon.src = `icons/${weather.icon}.svg`;
  let backgroundImageSrc;

  try {
    backgroundImageSrc = await getPixabyPicture(weather.description);
  } catch (error) {
    backgroundImageSrc = 'default-background.jpg';
  }

  await setBodyBackgroundImage(backgroundImageSrc);
}

function initChangeUnitsListener(temperature, feelsLike) {
  const temperatureUnitsToggle = document.querySelector('.weather-main__temp-unit');
  temperatureUnitsToggle.textContent = 'C';

  temperatureUnitsToggle.onclick = () => {
    if (temperatureUnitsToggle.textContent === 'C') {
      temperatureUnitsToggle.textContent = 'F';
      temperature.textContent = formatTemperature(+temperature.textContent * 1.8 + 32);
      feelsLike.textContent = formatTemperature(+feelsLike.textContent * 1.8 + 32);
    } else {
      temperatureUnitsToggle.textContent = 'C';
      temperature.textContent = formatTemperature((+temperature.textContent - 32) / 1.8);
      feelsLike.textContent = formatTemperature((+feelsLike.textContent - 32) / 1.8);
    }
  };
}

function formatTemperature(value) {
  value = Math.round(value);
  if (value > 0) return `+${value}`;
  return value;
}

async function getPixabyPicture(description) {
  const queryText = description.replace(/\s/g, '+');
  const apiKey = '18227191-fcb06157a5540c6d2c9d55d91';
  const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${queryText}&lang=ru&image_type=photo&category=backgrounds+nature+places&per_page=3`);
  if (!response.ok) throw new Error('Image did not received');
  const result = await response.json();
  return result.hits[0].largeImageURL;
}

function setBodyBackgroundImage(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.src = url;
    document.body.style.backgroundImage = `url(${url})`;
    img.onload = resolve;
  });
}

function addWarning(message) {
  const formSearch = document.querySelector('[data-search-form]');
  const inputSearch = document.querySelector('[data-search-input]');
  const locationButton = document.querySelector('[data-location-button]');
  const warningElement = document.createElement('span');
  formSearch.append(warningElement);
  warningElement.textContent = message;
  warningElement.className = 'warning-element';
  warningElement.style.position = 'absolute';
  warningElement.style.left = '0';
  warningElement.style.top = `${formSearch.offsetHeight + 5}px`;

  const removeWarningElement = () => warningElement.remove();

  inputSearch.addEventListener('input', removeWarningElement);
  formSearch.addEventListener('submit', removeWarningElement);
  locationButton.addEventListener('click', removeWarningElement);
}

function togglePreloader() {
  const preloaderElement = document.querySelector('[data-preloader]');
  preloaderElement.classList.toggle('preloader--show');
}
},{}],"js/location.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserLocation = getUserLocation;

var _display = require("./display");

function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function getUserLocation() {
  let position;

  try {
    if (localStorage.getItem('locationAllowed') === 'false') throw new Error('Geolocation does not allowed');
    position = await getPosition();
    localStorage.setItem('locationAllowed', true);
  } catch (error) {
    if (error instanceof GeolocationPositionError && error.code === 1 || error.message === 'Geolocation does not allowed') {
      (0, _display.addWarning)('Вы запретили определение геолокации. Найдите свой город\u00A0выше!\u00A0👆🏼');
      localStorage.setItem('locationAllowed', false);
    }

    throw error;
  }

  const apiKey = 'cd0bd47c-5f52-4228-b580-3cde6b7d8c6b';
  const response = await fetch(`https://geocode-maps.yandex.ru/1.x?geocode=${position.coords.longitude},${position.coords.latitude}&apikey=${apiKey}&format=json&results=1`);
  if (!response.ok) throw new Error(response.status);
  const result = await response.json();
  const addressComponents = result.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.Components;
  const {
    cityName,
    countryName
  } = getAddressDetails(addressComponents);
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    address: `${cityName}, ${countryName}`
  };
}

function getAddressDetails(components) {
  let cityName;
  let countryName;

  for (let component of components) {
    if (component.kind === 'country') countryName = component.name;
    if (component.kind === 'locality') cityName = component.name;
  }

  if (!cityName) cityName = components[components.length - 1].name;
  return {
    cityName,
    countryName
  };
}
},{"./display":"js/display.js"}],"js/search.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSearchListeners = initSearchListeners;

var _weather = require("./weather");

var _location = require("./location");

var _display = require("./display");

function initSearchListeners() {
  initInputSearch();
  initLocationSearch();
}

function initInputSearch() {
  const searchInput = document.querySelector('[data-search-input]');
  const searchForm = document.querySelector('[data-search-form]');
  ymaps.ready(init);

  function init() {
    let suggestView1 = new ymaps.SuggestView(searchInput);
  }

  searchForm.addEventListener('submit', async event => {
    event.preventDefault();
    (0, _display.togglePreloader)();
    const searchValue = searchInput.value;

    if (!searchValue) {
      (0, _display.togglePreloader)();
      return;
    }

    try {
      const apiKey = 'cd0bd47c-5f52-4228-b580-3cde6b7d8c6b';
      const response = await fetch(`https://geocode-maps.yandex.ru/1.x?geocode=${searchValue}&apikey=${apiKey}&format=json&results=1`);
      if (!response.ok) throw new Error(response.status);
      const result = await response.json();

      if (result.response.GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData.found === '0') {
        (0, _display.addWarning)('По вашему запросу город не найден 😞. Попробуйте снова!');
        (0, _display.togglePreloader)();
        return;
      }

      const coords = result.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
      let cityName;

      for (let component of result.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.Components) {
        if (component.kind === 'locality') cityName = component.name;
      }

      if (!cityName) cityName = result.response.GeoObjectCollection.featureMember[0].GeoObject.name;
      const countryName = result.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.CountryName;

      if (cityName === countryName) {
        (0, _display.addWarning)('Введите корректное название города 😕');
        (0, _display.togglePreloader)();
        return;
      }

      const address = `${cityName}, ${countryName}`;
      const weather = await (0, _weather.getWeather)(...coords.split(' ').reverse().map(i => +i));
      await (0, _display.displayWeather)(weather, address);
    } catch (error) {
      console.log(error);
    }

    (0, _display.togglePreloader)();
  });
}

function initLocationSearch() {
  const locationButton = document.querySelector('[data-location-button]');
  locationButton.addEventListener('click', async () => {
    (0, _display.togglePreloader)();

    try {
      const location = await (0, _location.getUserLocation)();
      const weather = await (0, _weather.getWeather)(location.latitude, location.longitude);
      await (0, _display.displayWeather)(weather, location.address);
    } catch (error) {
      console.log(error);
    }

    (0, _display.togglePreloader)();
  });
}
},{"./weather":"js/weather.js","./location":"js/location.js","./display":"js/display.js"}],"js/script.js":[function(require,module,exports) {
"use strict";

var _weather = require("./weather");

var _location = require("./location");

var _search = require("./search");

var _display = require("./display");

window.addEventListener('load', async () => {
  window.onerror = _display.togglePreloader;
  window.addEventListener('beforeunload', () => localStorage.clear());

  try {
    await showUserLocalWeather();
    setCurrentDate();
    (0, _search.initSearchListeners)();
  } catch (error) {
    console.log(error);
  }
});

async function showUserLocalWeather() {
  (0, _display.togglePreloader)();

  try {
    const location = await (0, _location.getUserLocation)();
    const weather = await (0, _weather.getWeather)(location.latitude, location.longitude);
    await (0, _display.displayWeather)(weather, location.address);
  } catch (error) {
    console.log(error);
  }

  (0, _display.togglePreloader)();
}

function setCurrentDate() {
  const dateLine = document.querySelector('.app__date');
  const currentDate = new Date();
  const date = currentDate.getDate() >= 10 ? currentDate.getDate() : `0${currentDate.getDate()}`;
  const month = currentDate.getMonth() >= 10 ? currentDate.getMonth() + 1 : `0${currentDate.getMonth() + 1}`;
  const year = currentDate.getFullYear();
  dateLine.innerHTML = `${date}.${month}.${year}`;
}
},{"./weather":"js/weather.js","./location":"js/location.js","./search":"js/search.js","./display":"js/display.js"}],"../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51935" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/script.js"], null)
//# sourceMappingURL=/script.d573be0b.js.map