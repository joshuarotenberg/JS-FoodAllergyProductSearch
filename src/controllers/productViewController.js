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
    const masterAllergenList = [];


    Handlebars.registerHelper('checklength', function (v1, v2, options) {
    'use strict';
        if (v1.length>v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });


    // allergen Arrays with common or hidden ingredients

    const eggAllergens = ['albumin','apovitellin','cholesterol free egg substitute','dried egg solids','dried egg','egg','eggs','egg substitute','egg substitutes','egg white','egg whites','egg yolk','egg yolks','egg wash','eggnog','fat substitutes','globulin','livetin','lysozyme','mayonnaise','meringue','meringue powder','ovalbumin','ovoglobulin','ovomucoid','ovomucin','ovotransferrin','ovovitelia','ovovitellin','powdered eggs','silici albuminate','simplesse','trailblazer','vitellin'];
    const peanutAllergens = ['arachic oil','arachis','arachis hypogaea','artificial nuts','beer nuts','boiled peanuts','cold pressed','extruded peanut oil','expelled peanut oil','crushed nuts','crushed peanuts','earth nuts','goober peas','ground nuts','ground peanuts','hydrolyzed peanut protein','mandelonas','mixed nuts','monkey nuts','nu nuts flavored nuts','nut pieces','nutmeat','peanuts','peanut butter','peanut butter chips','peanut butter morsels','peanut flour','peanut paste','peanut sauce','peanut syrup','spanish peanuts','virginia peanuts','lupine','peanut'];
    const treeNutAllergens = ['almond','almond paste','anacardium nuts','anacardium occidentale','artificial nuts','beech nut','brazil nut','bertholletia excelsa','bush nut','butternut','butyrospermum parkii','canarium ovatum','caponata','carya illinoensis','carya spp','cashew','castanea pumila','castanea spp','chestnut','chinese chestnut','american chestnut','european chestnut','seguin chestnut','chinquapin chestnut','coconut','cocos nucifera','corylus spp','filbert','fagus spp','gianduja','ginko nut','ginkgo biloba','hazelnut','heartnut','hickory nut','indian nut','juglans cinerea','juglans spp','karite','lichee nut','litchi chinensis','lychee nut','macadamia nut','macadamia spp','mandelonas','marzipan','mashuga nuts','nangai nuts','natural nut extract','nougat','nu-nuts®','nut butters','almond butter','hazelnut butter','brazil nut butter','macadamia nut butter','pistachio nut butter','shea nut butter','karike butter','nut meal','nutella','nutmeat','nut oil','nut paste','nut pieces','pecan','pigñolia','pili nut','pine nut','pinon nut','piñon','piñon nut','pinus spp','pistachio','pistacia','pralines','prunus dulcis','shea nut','sheanut','vitellaria paradoxa','walnut','english walnut','persian walnut','black walnut','japanese walnut','california walnut'];
    const milkAllergens = ['butter','casein','caseinates','cheese','cream','curds','custard','dairy product solids','galactose','ghee','half & half','hydrolysates','lactalbumin','lactate solids','lactitol monohydrate','lactoglobulin','lactose','lactulose','lactyc yeast','milk','nisin preparation','nougat','pudding','quark','recaldent','rennet','simplesse','whey','yogurt','acidophilus milk','buttermilk','buttermilk blend','buttermilk solids','cultured milk','condensed milk','dried milk','dry milk solids (dms)','evaporated milk','fat‐free milk','fully cream milk powder','goat’s milk','lactaid® milk','lactose free milk','low fat milk','malted milk','milk derivative','milk powder','milk protein','milk solids','milk solid pastes','nonfat dry milk','nonfat milk','nonfat milk solids','pasteurized milk','powdered milk','sheep’s milk','skim milk','skim milk powder','sour milk','sour milk solids','sweet cream buttermilk powder','sweetened condensed milk','sweetened condensed skim milk','whole milk','1% milk','2% milk','milks','artificial butter','artificial butter flavor','butter extract','butter fat','butter flavored oil','butter solids','dairy butter','natural butter','natural butter flavor','whipped butter','ammonium caseinate','calcium caseinate','hydrolyzed casein','iron caseinate magnesium caseinate','potassium caseinate','sodium caseinate','zinc caseinate','acid whey','cured whey','delactosed whey','demineralized whey','hydrolyzed whey','powdered whey','reduced mineral whey','sweet dairy whey','whey protein','whey protein concentrate','whey powder','whey solids','sour cream','sour cream solids','imitation sour cream','whipped cream','yogurt powder','frozen yogurt'];
    const soyAllergens = ['bean curd','edamame','kinako','koya dofu','miso','natto','okara','shoyu','soy','soya','soybean','supro','tamari','tempeh','teriyaki sauce','textured vegetable protein','tofu','yaki-dofu','yuba'];
    const wheatAllergens = ['wheat flour','enriched wheat flour','wheat','all purpose flour','bread','bread crumbs','bulgur','cereal extract','couscous','cracker meal','einkorn','emmer','farro','farina','flour','atta flour','club flour','common flour','durum flour','einkorn flour','emmer flour','farina flour','graham flour','kamut flour','maida flour','semolina flour','spelt flour','triticale flour','triticum flour','bread flour','bromated flour','cake flour','enriched flour','high gluten flour','high protein flour','instant pastry flour','phosphated flour','plain flour','soft wheat flour','steel ground flour','stone flour','ground flour','self-rising flour','unbleached flour','white flour','whole wheat flour','fu','gluten','wheat gluten','vital gluten','vital wheat gluten','kamut','khorasan wheat','malt','malt extract','matzo','matzo meal','matzoh','matzah','matza','matzoh meal','matzah meal','matza meal','noodles','pasta','seitan','semolina','spelt','tabbouleh','triticale','triticum','whole wheat','wheat berries','wheat bran','whole wheat bread','wheat germ','wheat germ oil','wheat protein isolate','wheat starch','wheat sprouts','sprouted wheat','wheatgrass'];
    const sesameAllergens = ['benne','benniseed','gingelly','gomasio','halvah','sesame', 'sesame oil','sesamol','sesamum indicum','sesemolina','sim sim','tahina','tahini','tehina','til'];
    
    // pull allergen profiles to build masterAllergenArray

    database
        .ref("profiles")
        .on("value", (results) => {
            results.forEach((result) => {
                const profile = result.val();
                const profileId = result.key;
                
                console.log(`${profileId}: ${profile.allergens}`);

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
                 console.log("has egg listed");
                }  
                if (isPeanut) {
                    masterAllergenList.push(...peanutAllergens);
                 console.log("has peanuts listed");

                }  
                if (isTreeNut) {
                    masterAllergenList.push(...treeNutAllergens);
                 console.log("has tree nuts listed");

                }  
                if (isMilk) {
                    masterAllergenList.push(...milkAllergens);
                 console.log("has milk listed");

                }  
                if (isSoy) {
                    masterAllergenList.push(...soyAllergens);
                 console.log("has soy listed");

                }  
                if (isWheat) {
                    masterAllergenList.push(...wheatAllergens);
                 console.log("has wheat listed");

                }  
                if (isSesame) {
                    masterAllergenList.push(...sesameAllergens);
                 console.log("has sesame listed");

                }                    
            });

        });
    

        // make this a dictionary => object keys = milk, soy, value = monster array


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
            const ingredientsObj = fullProduct.ingredients;

            const ingredients = ingredientsObj.map(ing => ing.name);
            const foundAllergen = ingredients.some(r => masterAllergenList.includes(r))

            // stringify ingredient array

            let filteredAllergens = masterAllergenList.filter(el => ingredients.includes(el));
            console.log(filteredAllergens); 

            console.log(`ingredients: ${ingredients}`);
            console.log(`myAllergens: ${masterAllergenList}`);
            console.log(`allergenList: ${filteredAllergens}`);

            
            document.getElementById("root").innerHTML = productPageFunc({
                title: fullProduct.title,
                image: fullProduct.images[0],
                brand: fullProduct.brand,
                productId: fullProduct.id,
                ingredientList: fullProduct.ingredientList,
                badges: fullProduct.importantBadges,
                matches: filteredAllergens
            });

            if (foundAllergen) {
                console.log('we found a match');
            } else {
                console.log('this is safe');
            }

   
        });

        // click handlers
        document
        .addEventListener("click", (event) => {
            event.preventDefault();
            if (event.target.classList.contains("search-input")){
                console.log("clicked search");
                window.location.href = "#/search";
            }
            if (event.target.classList.contains("nav-search")){
                console.log("clicked search nav link");
                window.location.href = "#/search";
            }
            if (event.target.classList.contains("nav-allergens")){
                console.log("clicked allergen nav link");
                window.location.href = "#/allergens";
            }
        });
    }
}