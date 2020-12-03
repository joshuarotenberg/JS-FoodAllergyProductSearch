import axios from "axios";
import Handlebars from "handlebars";


export default function searchIndexController() {

  // prep HBS templates

    axios
    .get("templates/searchIndex.hbs")
    .then((searchIndexResponse) => {
      axios
      .get("templates/searchResults.hbs")
      .then((searchResultsReponse) => {
        return render(searchIndexResponse.data, searchResultsReponse.data);
      });
    });

    // render hbs templates with logic/content/data

    function render(searchIndexTemplateHtml, searchResultsTemplateHtmll) {
        const searchIndexTemplateFunc = Handlebars.compile(searchIndexTemplateHtml);
        const searchResultsTemplateFunc = Handlebars.compile(searchResultsTemplateHtmll);

    
        document
        .getElementById("root")
        .innerHTML = searchIndexTemplateFunc();

        const form = document
        .getElementById("product-search-form")

        // product search form => two API calls: 1.) first to grab product suggestions 2.) pass selected product id for full product details
        
        form
        .addEventListener("submit", (event) => {
            event.preventDefault();
            console.log("product search submitted");
            const query = document.getElementById("product-search-query").value;
            console.log(query);

            // grab product guggestions

            const options = {
                method: 'GET',
                url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/products/suggest',
                params: {query: `${query}`, number: '12'},
                headers: {
                  'x-rapidapi-key': 'ba45fa9a58msh724b8c84403afebp18e0b3jsnff0f7c27def7',
                  'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
                }
              };
              
              axios.request(options)
              .then(function (response) {
                
                document.getElementById("product-index").innerHTML = "";

                  const products = response.data.results;

                  // list products

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

                        // hide search index placeholder
                        document.getElementById("product-index-placeholder").setAttribute("style","display:none;");

                        // display header when products are returned
                        document.getElementById("result-title").setAttribute("style","display:block;");
                            const fullProduct = response.data;
                            console.log(fullProduct);  
                            
                          // ship product details to results template
                          document.getElementById("product-index").innerHTML += searchResultsTemplateFunc({
                           title: fullProduct.title,
                           image: fullProduct.images[0],
                           brand: fullProduct.brand,
                           productId: fullProduct.id
                          //  ingredientList: fullProduct.ingredientList,
                          //  badges: fullProduct.importantBadges
                        });


                          //event click handlers

                          document
                          .addEventListener("click", (e) => {
                            e.preventDefault();
                            if(e.target.classList.contains("view-product-button")) {
                              const productId = e.target.id;
                              console.log(productId);

                              // store product id, for use on product page
                              window.localStorage.setItem("productId", productId);
                              window.location.href = "#/product";
                            }
                            // reload search form if looking at products
                            if (e.target.classList.contains("search-input")){
                              document.getElementById("product-index").innerHTML = "";
                              console.log("clicked search");
                              window.location.reload();
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