
var main = require('./src/main')    


var port = process.env.PORT || 3000  // establecemos nuestro puerto


const app = main.app;


// iniciamos nuestro servidor
app.listen(port)
console.log('API escuchando en el puerto ' + port)