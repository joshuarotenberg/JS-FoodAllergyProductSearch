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


    // allergen Arrays with common or hidden ingredients

    const eggAllergens = ['albumin','apovitellin','egg','fat substitutes','globulin','livetin','lysozyme','mayonnaise','meringue','ovalbumin','ovoglobulin','ovomucin','ovomucoid','ovotransferrin','ovovitelia','ovovitellin','simplesse','trailblazer','vitellin'];
    const peanutAllergens = ['arachic oil','arachis','arachis hypogaea','artificial nuts','beer nuts','crushed nuts','earth nuts','goober peas','ground nuts','lupine','mandelonas','mixed nuts','monkey nuts','nu nuts flavored nuts','nut pieces','nutmeat','peanut'];
    const treeNutAllergens = ['anacardiaceae','betulaceae','burseraceae','butternut','butyrospermum parkii','canarium ovatum','caponata','carya illinoensis','carya spp','cashew','castanea','castanea pumila','chestnut','chinquapin','coconut','cocos nucifera','corylus','fagaceae','fagus','filbert','gianduja','ginkgoaceae','ginko','hazelnut','heartnut','hickory nut','indian nut','juglandaceae','juglans cinerea','juglans spp','karite','lichee','litchi','lychee','macadamia','mandelonas','marzipan','nougat','nu-nuts','nut','nutella','nutmeat','palmae','pecan','pigñolia','pili nut','pineaceae','pinon','piñon','pinus spp','pistachio','pistacia vera','pralines','proteaceae','prunus dulcis','rosaceae','sapindaceae','sapotaceae','shea','vitellaria paradoxa'];
    const milkAllergens = ['butter','casein','caseinates','cheese','cream','curds','custard','dairy product solids','galactose','ghee','half & half','hydrolysates','lactalbumin','lactate solids','lactitol monohydrate','lactoglobulin','lactose','lactulose','lactyc yeast','milk','nisin preparation','nougat','pudding','quark','recaldent','rennet','simplesse','whey','yogurt'];
    const soyAllergens = ['bean curd','edamame','kinako','koya dofu','miso','natto','okara','shoyu','soy','soya','soybean','supro','tamari','tempeh','teriyaki sauce','textured vegetable protein','tofu','yaki-dofu','yuba'];
    const wheatAllergens = ['bread','bulgur','cereal extract','couscous','cracker meal','einkorn','emmer','farina','farro','flour','fu','gluten','kamut','malt','matza','matzah','matzo','noodles','pasta','seitan','semolina','spelt','tabbouleh','triticale','triticum','wheat','wheatgrass'];
    const sesameAllergens = ['benne','benniseed','gingelly','gomasio','halvah','sesame','sesamol','sesamum indicum','sesemolina','sim sim','tahina','tahini','tehina','til'];
    
    // pull allergen profiles to build masterAllergenArray

    database
        .ref("profiles")
        .on("value", (results) => {
            results.forEach((result) => {
                const masterAllergenList = [];

                const profile = result.val();
                const profileId = result.key;
                
                console.log(profile.allergens);

                const profileAllergens = profile.allergens;
                const isEgg = profileAllergens.includes("eggs");
                const isPeanut = profileAllergens.includes("peanuts");
                const isTreeNut = profileAllergens.includes("tree-nuts");
                const isMilk = profileAllergens.includes("milk");
                const isSoy = profileAllergens.includes("soy");
                const isWheat = profileAllergens.includes("wheat");
                const isSesame = profileAllergens.includes("sesame");

                if(isEgg) {
                 masterAllergenList.push(...eggAllergens);
                } else if (isPeanut) {
                    masterAllergenList.push(...peanutAllergens);
                } else if (isTreeNut) {
                    masterAllergenList.push(...treeNutAllergens);
                } else if (isMilk) {
                    masterAllergenList.push(...milkAllergens);
                } else if (isSoy) {
                    masterAllergenList.push(...soyAllergens);
                } else if (isWheat) {
                    masterAllergenList.push(...wheatAllergens);
                } else if (isSesame) {
                    masterAllergenList.push(...sesameAllergens);
                }                    
            });

        });
    


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

            console.log(masterAllergenList);
   
        });
    }
}