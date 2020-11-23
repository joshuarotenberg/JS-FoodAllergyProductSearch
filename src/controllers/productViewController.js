import axios from "axios";
import Handlebars from "handlebars";

import database from "../firebaseConfig";


export default function productViewController() {
  axios
  .get("templates/productViewResult.hbs")
  .then((response) => {
    const productPageHtml = response.data;
    return render(productPageHtml);
  });

  function render(productPageHtml) {

    const productPageFunc = Handlebars.compile(productPageHtml);

    const productId = window.localStorage.getItem("productId");

    const options = {
        method: 'GET',
        url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/products/${productId}`,
        headers: {
          'x-rapidapi-key': 'ba45fa9a58msh724b8c84403afebp18e0b3jsnff0f7c27def7',
          'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
      };
      
      axios
      .request(options)
      .then(function (response) {
            const fullProduct = response.data;
            console.log(fullProduct);                       
            
            document.getElementById("root").innerHTML = productPageFunc({
            title: fullProduct.title,
            image: fullProduct.images[0],
            brand: fullProduct.brand,
            productId: fullProduct.id,
            ingredientList: fullProduct.ingredientList,
            badges: fullProduct.importantBadges
            });

   
        });
    }
}