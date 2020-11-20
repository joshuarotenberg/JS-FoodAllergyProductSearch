import axios from "axios";
import Handlebars from "handlebars";
import database from "../firebaseConfig";


export default function profileIndexController() {

    axios
    .get("templates/profileIndex.hbs")
    .then((profileIndexResponse) => {
      axios
      .get("templates/profileResults.hbs")
      .then((profileResultsReponse) => {
        return render(profileIndexResponse.data, profileResultsReponse.data);
      });
    });

    function render(profileIndexTemplateHtml, profileResultsTemplateHtmll) {
        const profileIndexTemplateFunc = Handlebars.compile(profileIndexTemplateHtml);
        const profileResultsTemplateFunc = Handlebars.compile(profileResultsTemplateHtmll);


       
        // display wines from firebase in root
    
        document
        .getElementById("root")
        .innerHTML = profileIndexTemplateFunc();



    }
}