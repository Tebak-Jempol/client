import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCOSq0cOMVnzXDzLAQAlzXvzIxUCYUMxh0",
    authDomain: "realtime-vue.firebaseapp.com",
    databaseURL: "https://realtime-vue.firebaseio.com",
    projectId: "realtime-vue",
    storageBucket: "realtime-vue.appspot.com",
    messagingSenderId: "322108038017"
};

const database = firebase.initializeApp(config).database();

export default database;