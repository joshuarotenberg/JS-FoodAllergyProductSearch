import axios from "axios";
import Handlebars from "handlebars";
import database from "../firebaseConfig";


export default function allergenIndexController() {

  Handlebars.registerHelper('ifIn', function(elem, list, options) {
    if(list.indexOf(elem) > -1) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

    axios
    .get("templates/allergenIndex.hbs")
    .then((allergenIndexResponse) => {
      axios
      .get("templates/allergenResults.hbs")
      .then((allergenResultsReponse) => {
        axios
        .get("templates/editAllergenForm.hbs")
        .then((editAllergenReponse) => {
          return render(allergenIndexResponse.data, allergenResultsReponse.data, editAllergenReponse.data);
        });
      });
    });

    function render(allergenIndexTemplateHtml, allergenResultsTemplateHtml, editAllergenTemplateHtml) {
        const allergenIndexTemplateFunc = Handlebars.compile(allergenIndexTemplateHtml);
        const allergenResultsTemplateFunc = Handlebars.compile(allergenResultsTemplateHtml);
        const editAllergenTemplateFunc = Handlebars.compile(editAllergenTemplateHtml);

    
        document
        .getElementById("root")
        .innerHTML = allergenIndexTemplateFunc();


        ////// create new allergen profile

        const allergenForm = document
        .getElementById("allergen-profile-form");
        
        allergenForm.addEventListener("submit", (event) => {
          event.preventDefault();
          console.log("form submitted");

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

        });

        // display profiles on /allergens page

        const allergenIndex = document.getElementById("allergen-index");

        database
        .ref("profiles")
        .on("value", (results) => {
          allergenIndex.innerHTML = "";

            results.forEach((result) => {

                const profile = result.val();
                const profileId = result.key;
                
                allergenIndex.innerHTML += allergenResultsTemplateFunc({...profile,
                    profileId: profileId 
                });

                    
            });

        });

        // check to see if profile exists and remove welcome div

        database
        .ref("profiles")
        .once("value")
        .then(function(snapshot) {
          const profileExists = snapshot.exists();  // true
          if (profileExists) {
            document.getElementById("welcome").innerHTML = "";
          }
        });

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

                  // event delegators

                  document
                  .addEventListener("click", (event) => {
                    if (event.target.classList.contains("edit-profile-button")) {
                      console.log("clicking edit button");

                      // grab profileId from edit button

                      const profileId = event.target.id;
                      console.log(profileId);

                      document
                      .querySelector(".edit-modal")
                      .setAttribute('id', `edit-profile-modal${profileId}`);
      
                      $('.edit-profile-modal').modal('show');
      
      
                      // pull in profile for update
      
                          database
                          .ref("profiles")
                          .child(profileId)
                          .on("value", (results) => {
                              const oneProfile = results.val();
      
                              document
                              .getElementById("edit-modal-form")
                              .innerHTML = editAllergenTemplateFunc(oneProfile);
                          });
                    }  // end edit button event

                  });


                   
    
    }
}