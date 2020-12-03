# Final Project:

For the final project, you'll be designing and building a web app of your choice. This project will test your knowledge of JavaScript and ask you to apply everything you've learned in this course. The result will be a web app that you can add to your portfolio. You could create anything from: a blog users can comment on; an app that allows users to search for social media posts; or even an application that logs users geolocations. Work with your instructor to create project goals that are realistic given the scope and timing of the class.

## Technical Requirements

Use JavaScript to correctly structure the code for a web application:

- Structure your application to be a SPA (single page application)
- Make HTTP requests to your own Firebase URL
- Make at least one HTTP request to a third-party server
- CRUD functionality should be present
- Perform DOM manipulation
- Listen for events and add interactivity based on user input

Hosting:

- App must be hosted on either GitHub Pages or Heroku

## [Food Allergen Product Search] (https://pages.git.generalassemb.ly/JSR-922/FinalProject-JoshuaRotenberg-FoodAllergyProductSearch/#/search)

Tools/Frameworks used:

- Single Page Application (Pure Javascript )
  - custom routes and components
- [Firebase](https://firebase.google.com) (Realtime Database)
- [Axios](https://github.com/axios/axios) (Promise based HTTP client)
- [Handlebars](https://handlebarsjs.com/) (Javascript Template Engine)
- [Bootstrap](https://getbootstrap.com) (Front end Framework)
- [Font Awesome](https://fontawesome.com/) (Icon library)

### Allergen Profile

User can create allergen profile by selecting common food allergies. All crud actions (Create, Read, Update, & Delete) are available via Firebase.

### Product Search

A user can get product suggestions via the search bar. Two API calls are made to spoonacular API:

1.  makes a `GET` call using a partial or full product search to `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/products/suggest` which expects a `query`, returning a list of **product ids**.
2.  makes a `GET` call using the product id `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/products/${productId}` and returns products cards with full product details

### Product View

When you view a products detail page, the app looks the products ingredients and matches them a pre-built array of the user's allergen profile for matches and then displays either a safe product box or danger product box.

The user can add any dangerous products to their Danger List.

### Danger List

Collection of cards added from product show page will exist here and stored in firebase.

## Technical Hurdles

1.  Data Organization
    - figuring out how to organize data and app
2.  Ingredients vs Allergen List Matching
    - Arrays vs Objects and filtering

## What I learned

This was an invaluable experience, not withstanding.

- An application of this magnitude should use an SPA framework like react. I felt like it lacks components and organization
- Handlebars has awesome helpers:
  - `{{#each array}}` => will loop through anything that is passed as an array `{{this}}` will be printed.
  - You can build custom helpers: I used this to check if the table existed for view manipulation
