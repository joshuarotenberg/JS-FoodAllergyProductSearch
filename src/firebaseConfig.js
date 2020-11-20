import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCXOt67sYgk_66Rb7_e3nO-o8lVafiZ-X8",
    authDomain: "food-allergy-product-app.firebaseapp.com",
    databaseURL: "https://food-allergy-product-app.firebaseio.com",
    projectId: "food-allergy-product-app",
    storageBucket: "food-allergy-product-app.appspot.com",
    messagingSenderId: "96687262699",
    appId: "1:96687262699:web:ca7b2fcbe6c89b5fa267ae"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const database = firebaseApp.database();

export default database;