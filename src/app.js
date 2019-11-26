'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const request = require('request')
const app = new App();
var pizzaData={number:'',location:''};
app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    
    LAUNCH() {
        return this.toIntent('PizzaIntent');
    },

    PizzaIntent() {
        this.ask('do like to order some pizza ?');
    },
    yesIntent()
    {
        this.ask('How many pizza you want ?')
    },
  
    AskForPreciseLocationIntent() {
        pizzaData.number = this.$inputs.number.value;
        this.$googleAction.askForPreciseLocation('For pizza');
    },
    
   
    async ON_PERMISSION() {

        if (this.$googleAction.isPermissionGranted()) {
            
            console.log(this.$googleAction.getDevice());
            pizzaData.location = this.$googleAction.getDevice()
            const starWars = await deliveryData(pizzaData)
            this.tell(`thanks your order will be delivered and is ${starWars}`);
        } else {
            this.tell('too bad sorry pizza');
        }
    },
   
   
});


async function  deliveryData(pizzaData) {
    return new Promise(async (resolve, reject)=>{
         await request.post({
            headers: {'content-type' : 'application/json'},
            url:     'http://localhost:4000/pizza',
            json: true,
            body:    pizzaData,
          }, function(error, response, body){
            console.log(body);
            if(body!==null)
            {
                resolve(
                    body
                )
            }
            else{
                reject(error)
            }
          });
    })   
}
module.exports.app = app;
