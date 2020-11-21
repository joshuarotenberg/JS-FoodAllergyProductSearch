import axios from "axios";
import Handlebars from "handlebars";
import database from "../firebaseConfig";


export default function searchIndexController() {

    axios
    .get("templates/searchIndex.hbs")
    .then((searchIndexResponse) => {
      axios
      .get("templates/searchResults.hbs")
      .then((searchResultsReponse) => {
        return render(searchIndexResponse.data, searchResultsReponse.data);
      });
    });

    function render(searchIndexTemplateHtml, searchResultsTemplateHtmll) {
        const searchIndexTemplateFunc = Handlebars.compile(searchIndexTemplateHtml);
        const searchResultsTemplateFunc = Handlebars.compile(searchResultsTemplateHtmll);


       
        // display wines from firebase in root
    
        document
        .getElementById("root")
        .innerHTML = searchIndexTemplateFunc();

        const form = document
        .getElementById("product-search-form")
        
        form
        .addEventListener("submit", (event) => {
            event.preventDefault();
            console.log("product search submitted");
            const query = document.getElementById("product-search-query").value;
            console.log(query);

            document.getElementById("product-index").innerHTML = "";

            const options = {
                method: 'GET',
                url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/products/suggest',
                params: {query: `${query}`, number: '6'},
                headers: {
                  'x-rapidapi-key': 'ba45fa9a58msh724b8c84403afebp18e0b3jsnff0f7c27def7',
                  'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
                }
              };
              
              axios.request(options)
              .then(function (response) {
                  console.log(response.data);
                  const products = response.data.results;

                  console.log(products);

                  products.forEach(product => {
                      console.log(`${product.title}: ${product.id}`);
                      const productId = product.id;
                      


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
                            console.log(fullProduct)
                            //grab and merge both badge arrays

                            const importantBadges = fullProduct.importantBadges;
                            const badges = fullProduct.badges;

                            const productBadges = [...new Set([...importantBadges ,...badges])];

                            const normalizedBadges = [];

                            productBadges.forEach(e => {
                                normalizedBadges.push(e.replaceAll('_', ' '));
                            });

                            console.log(normalizedBadges);
                            
                          document.getElementById("product-index").innerHTML += searchResultsTemplateFunc({
                           title: fullProduct.title,
                           image: fullProduct.images[0],
                           brand: fullProduct.brand,
                           ingredientList: fullProduct.ingredientList,
                           badges: normalizedBadges,
                        });

                        form.reset();
                        window.location.href = "#/search";
                      })
                      .catch(function (error) {
                          console.error(error);
                      });

                  })
                 

              }).catch(function (error) {
                  console.error(error);
              });
      
        })


       


    }
}