import * as functions from 'firebase-functions';
import { dialogflow, Permission, Suggestions } from 'actions-on-google';
import { add_intents as weather_intents } from './intents/weather';

const app = dialogflow({ debug: true });

app.intent('Default Welcome Intent', conv => {
    conv.ask(new Suggestions(['weather forecast', 'weather for exeter']))
    conv.ask("Hello to you sir.")
})

app.intent('say_hello', conv => {
    conv.close('hello to you too!')
})

app.intent('where_am_i', conv => {

    conv.data['have_asked'] = true;
    console.info('asking for location permission');
    conv.ask(new Suggestions(['yes', 'no']));
    conv.ask(new Permission({
        context: "To know your location",
        permissions: ['DEVICE_PRECISE_LOCATION']
    }));
})

weather_intents(app)


const handler = functions.https.onRequest(app);

export default handler