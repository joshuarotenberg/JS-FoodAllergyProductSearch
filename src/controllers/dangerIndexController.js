import axios from "axios";
import Handlebars from "handlebars";
import database from "../firebaseConfig";


export default function dangerIndexController() {

    axios
    .get("templates/dangerIndex.hbs")
    .then((dangerIndexResponse) => {
      axios
      .get("templates/dangerResults.hbs")
      .then((dangerResultsReponse) => {
        return render(dangerIndexResponse.data, dangerResultsReponse.data);
      });
    });

    function render(dangerIndexTemplateHtml, dangerResultsTemplateHtml) {
        const dangerIndexTemplateFunc = Handlebars.compile(dangerIndexTemplateHtml);
        const dangerResultsTemplateFunc = Handlebars.compile(dangerResultsTemplateHtml); 
    
        document
        .getElementById("root")
        .innerHTML = dangerIndexTemplateFunc();


        // display products on /danger page

        const dangerIndex = document.getElementById("danger-index");

        database
        .ref("productDanger")
        .on("value", (results) => {
            results.forEach((result) => {
                const productDanger = result.val();
                const productId = result.key;
                console.log(productDanger);
                
                dangerIndex.innerHTML += dangerResultsTemplateFunc({...productDanger, productId: productId 
                });

                    
            });

        });
                  
    
    }
}