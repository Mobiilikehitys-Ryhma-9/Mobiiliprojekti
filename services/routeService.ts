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
            extra_info: ["steepness"]
        })
    })

    const data = await response.json()

    const feature = data.features?.[0]
    
    const coords = feature?.geometry.coordinates.map(
        ([lon, lat]: [number, number]) => ({
        latitude: lat,
        longitude: lon
    }))

    const steepness = feature?.properties.extras?.steepness

    const steepnessValues: number[] = steepness?.values || []
    const steepnessSummary = steepness?.summary[0]
    let steepnessSummaryValue: number = steepnessSummary.value || 0
    switch (steepnessSummaryValue) {
        case -5:
            steepnessSummaryValue = -16
            break
        case -4:
            steepnessSummaryValue = -10
            break
        case -3:
            steepnessSummaryValue = -7
            break
        case -2:
            steepnessSummaryValue = -4
            break
        case -1:
            steepnessSummaryValue = -1
            break
        case 0:
            steepnessSummaryValue = 0
            break
        case 1:
            steepnessSummaryValue = 1
            break
        case 2:
            steepnessSummaryValue = 4
            break
        case 3:
            steepnessSummaryValue = 7
            break
        case 4:
            steepnessSummaryValue = 10
            break
        case 5:
            steepnessSummaryValue = 16
            break
    }
    const steepnessSummaryDistance: number = steepnessSummary.distance || 0
    const steepnessSummaryAmount: number = steepnessSummary.amount || 0
    return {
        routeCoords: coords,
        steepnessValues,
        steepnessSummaryValue,
        steepnessSummaryDistance,
        steepnessSummaryAmount
    }
}

export async function fetchRouteWithAvoidFeatures(startCoords: number[], endCoords: number[]): Promise<RouteResponse> {
    const response = await fetch(`${BASE_URL}/v2/directions/wheelchair/geojson`, {
        method: 'POST',
        headers: {
            Authorization: process.env.EXPO_PUBLIC_ORS_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            coordinates: [startCoords, endCoords],            
            extra_info: ["steepness"],
            options: {
                avoid_features: ['steps'],
                profile_params: {
                    restrictions: {
                        surface_type: 'cobblestone:flattened',
                        track_type: 'grade1',
                        smoothness_type: 'good',
                        maximum_sloped_kerb: 0.06,
                        maximum_incline: 6
                    }
                }
            }
        })
    })

    const data = await response.json()

    const feature = data.features?.[0]
    
    const coords = feature?.geometry.coordinates.map(
        ([lon, lat]: [number, number]) => ({
        latitude: lat,
        longitude: lon
    }))

    const steepness = feature?.properties.extras?.steepness

    const steepnessValues: number[] = steepness?.values || []
    const steepnessSummary = steepness?.summary[0]
    let steepnessSummaryValue: number = steepnessSummary.value || 0
    switch (steepnessSummaryValue) {
        case -5:
            steepnessSummaryValue = -16
            break
        case -4:
            steepnessSummaryValue = -10
            break
        case -3:
            steepnessSummaryValue = -7
            break
        case -2:
            steepnessSummaryValue = -4
            break
        case -1:
            steepnessSummaryValue = -1
            break
        case 0:
            steepnessSummaryValue = 0
            break
        case 1:
            steepnessSummaryValue = 1
            break
        case 2:
            steepnessSummaryValue = 4
            break
        case 3:
            steepnessSummaryValue = 7
            break
        case 4:
            steepnessSummaryValue = 10
            break
        case 5:
            steepnessSummaryValue = 16
            break
    }
    const steepnessSummaryDistance: number = steepnessSummary.distance || 0
    const steepnessSummaryAmount: number = steepnessSummary.amount || 0
    return {
        routeCoords: coords,
        steepnessValues,
        steepnessSummaryValue,
        steepnessSummaryDistance,
        steepnessSummaryAmount
    }
}