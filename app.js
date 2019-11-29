// var express = require('express');
// var app = express();
// app = express(); 
// app.use('/', express.static(__dirname + '/'));
// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// });


const express = require('express');
const app = express();
const path = require('path');


var firebase = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://arjsproject.firebaseio.com"
  });

var database = firebase.database();

//get all locations
app.get('/locations', async (request, response) => {
    try {
        let result = []
        const locationsRef = database.ref('locations');
        const locations = await locationsRef.once('value');
        locations.forEach(function(snapshot) {
            result.push({
                name:snapshot.val().name,
                desciption:snapshot.val().description?snapshot.val().description:'Empty Description',
                location: {
                    lat:snapshot.val().lat,
                    lng:snapshot.val().lng,
                }
            });
        })
      response.json(result);
  
    } catch(error){
  
      response.status(500).send(error);
  
    }
  
});

app.post('/location', async(request, response) => {
  try {
    let result = []
    const locationsRef = database.ref('locations');
    
    let randomLat = request.latitude + getRandomLocationNumber()
    let randomLng = request.longitude + getRandomLocationNumber()

    locationsRef.push({
      name: 'Random Test Name',
      lat:  randomLat,
      lng:  randomLng
    }).then(
        window.alert('Lat:'+ randomLat + ', Long:' + randomLng)
        ).then(
            window.location.reload()
    )

} catch(error){

  response.status(500).send(error);

}
})

//set index.html as our first page 
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use("/static", express.static('./static/'));

app.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running');
});



const getRandomLocationNumber = function(){
  return Math.floor(Math.random() * (0.009 - 0.001)) + 0.001
}