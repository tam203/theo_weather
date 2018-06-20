import { Permission, Parameters, DialogflowConversation } from "actions-on-google";
import { updateLocation, Location, deleteLocation, asLocation } from "../location";
import { getForecast } from "../forecast";

const GET_WEATHER_NO_CONTEXT_INTENT = 'get_weather_no_context'
const GET_WEATHER_WITH_CONTEXT_INTENT = 'get_weather_with_context'
const HANDLE_PERMISSION_INTENT = 'handle_permission'

export function add_intents(app: any) {
    app.intent(GET_WEATHER_NO_CONTEXT_INTENT, get_weather_no_context);
    app.intent(GET_WEATHER_WITH_CONTEXT_INTENT, get_weather_no_context);
    app.intent(HANDLE_PERMISSION_INTENT, handle_permission);

}
function get_weather_no_context(conv: DialogflowConversation, parms: Parameters) {
    const locationCtx = conv.contexts.get('location')
    console.warn(">>> location context is >>>", locationCtx)
    console.warn(">>> params,", parms)
    let location: Location = asLocation(parms)
    if (location) {
        location = updateLocation(location, conv);
        return forecastForLocation(conv, location)
    } else {
        // TODO: set context about what was requested.
        return askForLocation(conv)
    }
}

function askForLocation(conv: DialogflowConversation) {
    return conv.ask(new Permission({
        context: "To get the forecast for you",
        permissions: ['DEVICE_PRECISE_LOCATION']
    }));
}

function forecastForLocation(conv: DialogflowConversation, location: Location): Promise<string> {
    return getForecast(location)
    // if (location.locationName) {
    //     conv.ask(`This is your forecast for ${location.locationName}`)
    //     return;
    // }

    // if (!isNaN(location.latitude) && !isNaN(location.longitude)) {
    //     conv.ask(`This is your forecast for lat ${location.latitude}, lon ${location.longitude}`)
    //     return
    // }
    // console.error(">>>> The location has an issue for a forecast", location)
    // conv.close('There is an error with your location')
    // return;
}


function handle_permission(conv: DialogflowConversation, params, permissionGranted): Promise<any> {
    const deviceLocation = conv.device.location;
    if (permissionGranted && deviceLocation) {
        const forecastLocation = updateLocation(deviceLocation.coordinates, conv);
        return forecastForLocation(conv, forecastLocation).then(msg => conv.ask(msg))
    } else {
        deleteLocation(conv)
        conv.close(`Error getting location. permissionGranted=${permissionGranted} location=${deviceLocation}`)
        return Promise.resolve();
    }
}

