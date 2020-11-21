import axios from "axios";
import Handlebars from "handlebars";
import database from "../firebaseConfig";


export default function allergenIndexController() {

    axios
    .get("templates/allergenIndex.hbs")
    .then((allergenIndexResponse) => {
      axios
      .get("templates/allergenResults.hbs")
      .then((allergenResultsReponse) => {
        return render(allergenIndexResponse.data, allergenResultsReponse.data);
      });
    });

    function render(allergenIndexTemplateHtml, allergenResultsTemplateHtmll) {
        const allergenIndexTemplateFunc = Handlebars.compile(allergenIndexTemplateHtml);
        const allergenResultsTemplateFunc = Handlebars.compile(allergenResultsTemplateHtmll);

    
        document
        .getElementById("root")
        .innerHTML = allergenIndexTemplateFunc();


        // Shellfish Group

        const shellfish = document.querySelectorAll('.shellfish input.sub-options');
        console.log(shellfish);
           const checkall = document.getElementById('shellfish');

        for(let i=0; i< shellfish.length; i++) {
           shellfish[i].onclick = function() {
            
            let checkedCount = document.querySelectorAll('.shellfish input.sub-options:checked').length;

            checkall.checked = checkedCount > 0;
            checkall.indeterminate = checkedCount > 0 && checkedCount < shellfish.length;
          }
        }

        checkall.onclick = function() {
          for(let i=0; i< shellfish.length; i++) {
             shellfish[i].checked = this.checked;
          }
        }


            // Tree Nuts Group

          const treeNuts = document.querySelectorAll('.tree-nuts input.sub-options');
          console.log(treeNuts);
          const treeNutsChecksall = document.getElementById('tree-nuts');
  
          for(let i=0; i< treeNuts.length; i++) {
             treeNuts[i].onclick = function() {
              
              let treeNutsCHeckedCounts = document.querySelectorAll('.tree-nuts input.sub-options:checked').length;
  
              treeNutsChecksall.checked = treeNutsCHeckedCounts > 0;
              treeNutsChecksall.indeterminate = treeNutsCHeckedCounts > 0 && treeNutsCHeckedCounts < treeNuts.length;
            }
          }
  
          treeNutsChecksall.onclick = function() {
            for(let i=0; i< treeNuts.length; i++) {
               treeNuts[i].checked = this.checked;
            }
        
           }

           ////// grab Allergens selected

           const allergenForm = document
           .getElementById("allergen-profile-form");
           
           allergenForm.addEventListener("submit", (event) => {
             event.preventDefault();
              console.log("form submitted");

              const profileName = document.getElementById("profile-name").value;

              const myAllergens = [];

              allergenForm.querySelectorAll('input').forEach(function (input) {
                if(input.type === 'checkbox' && input.checked) {
                  myAllergens.push(input.value);
                }
              })

              console.log(myAllergens);


              const newProfile = {
                name: document.getElementById("profile-name").value,
                allergens: myAllergens
                }
                
                //add record to Firebase using the Firebase SDK

                console.log(newProfile);

                database
                .ref("profiles")
                .push(newProfile)
                .then(() => {          
                    $("#allergenModal").modal("hide");
                });

           })


    }
}