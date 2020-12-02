import allergenIndexController from "./controllers/allergenIndexController";
import searchIndexController from "./controllers/searchIndexController";
import productViewController from "./controllers/productViewController";
import dangerIndexController from "./controllers/dangerIndexController";

const routes = {
  "/allergens": allergenIndexController,
  "/search": searchIndexController,
  "/product": productViewController,
  "/danger-list": dangerIndexController
};

function setRoute() {

  const currentRoute = window
  .location
  .hash
  .split("#")[1];

  for (let route in routes) {
    if (currentRoute === route) {
      return routes[route]();
    }
  }

  // If nothing matches, trigger the search route
  window.location.hash = "/search";
}



// Trigger the function on page load
document.addEventListener("DOMContentLoaded", setRoute);

// Trigger the function when the hash changes
window.addEventListener("hashchange", setRoute);