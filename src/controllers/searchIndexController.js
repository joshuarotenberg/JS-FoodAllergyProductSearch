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

        const eggAllergenList = ['albumin','apovitellin','cholesterol free egg substitute','dried egg solids','dried egg','egg','egg white','egg yolk','egg wash','eggnog','fat substitutes','globulin','livetin','lysozyme','mayonnaise','meringue','meringue powder','ovalbumin','ovoglobulin','ovomucoid','ovomucin','ovotransferrin','ovovitelia','ovovitellin','powdered eggs','silici albuminate','simplesse','trailblazer','vitellin'];
        console.log(eggAllergenList);

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
                            console.log(fullProduct);                       
                            
                          document.getElementById("product-index").innerHTML += searchResultsTemplateFunc({
                           title: fullProduct.title,
                           image: fullProduct.images[0],
                           brand: fullProduct.brand,
                           productId: fullProduct.id
                          //  ingredientList: fullProduct.ingredientList,
                          //  badges: fullProduct.importantBadges
                        });

                        form.reset();
                        window.location.href = "#/search";

                          //event handler

                          document
                          .addEventListener("click", (e) => {
                            e.preventDefault();
                            console.log(e);                            
                            if(e.target.classList.contains("view-product-button")) {
                            const productId = e.target.id;
                            console.log(productId);

                              window.localStorage.setItem("productId", productId);
                              window.location.href = "#/product";

                            }
                          });
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