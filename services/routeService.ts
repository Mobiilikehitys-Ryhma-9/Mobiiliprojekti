import { RouteResponse } from '../types/route'

const BASE_URL = 'https://api.openrouteservice.org'

export async function fetchRoute(profile: string, startCoords: number[], endCoords: number[]): Promise<RouteResponse> {
    const response = await fetch(`${BASE_URL}/v2/directions/${profile}/geojson`, {
        method: 'POST',
        headers: {
            Authorization: process.env.EXPO_PUBLIC_ORS_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            coordinates: [startCoords, endCoords],
            elevation: true
        })
    })

    const data = await response.json()
    const coords = data.features[0].geometry.coordinates.map((p: number[]) => ({
        latitude: p[1],
        longitude: p[0]
    }))
    const routeResponse: RouteResponse = {routeCoords: coords, 
        elevation: data.features[0].properties.segments[0].ascent}
    return routeResponse
}