import profileIndexController from "./controllers/profileIndexController";
import allergenIndexController from "./controllers/allergenIndexController";

const routes = {
  "/dashboard": profileIndexController,
  "/allergens": allergenIndexController,
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
  window.location.hash = "/dashboard";
}



// Trigger the function on page load
document.addEventListener("DOMContentLoaded", setRoute);

// Trigger the function when the hash changes
window.addEventListener("hashchange", setRoute);