import { Location } from "./location";
import { config } from 'firebase-functions';
import fetch from 'node-fetch';

const API_KEY = process.env.geo_api_key;

export function getForecast(loc: Location): Promise<string> {
    let locName: Promise<string>;
    if (!loc.locationName) {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc.latitude},${loc.longitude}&key=${config().geo.api_key}`
        console.warn(`reveres geo url is ${url}`)
        locName = fetch(url, {
            headers: {
                "User-Agent": "theo-weather-app"
            }
        }).then(res => res.json()).then(res => {
            return res['results'][0]['address_components'].filter(components => components['types'].includes('postal_town'))[0]['long_name']
        })
    } else {
        locName = Promise.resolve(loc.locationName);
    }
    return locName.then(placeName => {
        const url = `${config().weather_api.url}place/${encodeURI(placeName)}/today/all`
        console.log(`weather look up url ${url}`)
        return fetch(url).then(res => res.json()).then(forecast => forecast.properties.concise)
    })
}