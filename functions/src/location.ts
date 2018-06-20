import { DialogflowConversation } from "actions-on-google";

const LOCATION_CTX = 'location'

export function getLastLocation(conv: DialogflowConversation): { lat: number, lon: number } {
    return (conv.user.storage as any).last_location
}

export interface Location {
    locationName?: string,
    latitude?: number,
    longitude?: number
}

export function asLocation(locationProps: any): Location {
    const loc = {
        locationName: locationProps.locationName,
        latitude: locationProps.latitude,
        longitude: locationProps.longitude
    }
    if (loc.locationName || (loc.latitude && loc.latitude)) {
        return loc
    }
    return null;
}

export function updateLocation(place: Location | string, conv: DialogflowConversation): Location {
    // TODO: store the place in context
    const location: Location = (typeof place === 'string') ? { locationName: place } : place

    console.warn('context was', conv.contexts.get(LOCATION_CTX))
    // TODO: location to object should be a function globally?
    conv.contexts.set(LOCATION_CTX, 5, {
        locationName: location.locationName,
        latitude: location.latitude,
        longitude: location.longitude,
    })
    return location
}

export function deleteLocation(conv: DialogflowConversation) {
    conv.contexts.delete(LOCATION_CTX)
}