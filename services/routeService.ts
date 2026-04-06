import { RouteOption, RouteResponse } from '../types/route'

const BASE_URL = 'https://api.openrouteservice.org'

export async function fetchFootwalkRoute(startCoords: number[], endCoords: number[]): Promise<RouteResponse> {
    const response = await fetch(`${BASE_URL}/v2/directions/foot-walking/geojson`, {
        method: 'POST',
        headers: {
            Authorization: process.env.EXPO_PUBLIC_ORS_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            coordinates: [startCoords, endCoords],
            extra_info: ["steepness"],
            alternative_routes: {
                target_count: 3, //= reittivahtoehtojen määrä
                weight_factor: 1.6, //= kerroin, kuinka paljon pidempi saa reitti korkeintaan olla
                share_factor: 0.6 //= kerroin, kuinka paljon reitti korkeintaan saa mennä samaa tietä
            }
        })
    })

    const data = await response.json()
    if (!data.features || data.features.length === 0) {
        throw new Error('No route found')
    }
    
    const routes: RouteOption[] = data.features.map((feature: any) => ({
        coords: feature.geometry.coordinates.map(
            ([lon, lat]: [number, number]) => ({
            latitude: lat,
            longitude: lon
        }))
    }))

    const feature = data.features[0]
    const steepness = feature?.properties.extras?.steepness
    const summary = steepness?.summary?.[0]
    let steepnessSummaryValue = summary?.value ?? 0
    switch (steepnessSummaryValue) {
        case -5: steepnessSummaryValue = -16; break
        case -4: steepnessSummaryValue = -10; break
        case -3: steepnessSummaryValue = -7; break
        case -2: steepnessSummaryValue = -4; break
        case -1: steepnessSummaryValue = -1; break
        case 0: steepnessSummaryValue = 0; break
        case 1: steepnessSummaryValue = 1; break
        case 2: steepnessSummaryValue = 4; break
        case 3: steepnessSummaryValue = 7; break
        case 4: steepnessSummaryValue = 10; break
        case 5: steepnessSummaryValue = 16; break
    }
    
    return {
        routes,
        steepnessSummaryValue,
        steepnessSummaryDistance: summary?.distance ?? 0,
        steepnessSummaryAmount: summary?.amount ?? 0,
        hasCobblestone: false
    }
}

export async function fetchWheelchairRoute(startCoords: number[], endCoords: number[],
    obstacles?: { latitude: number, longitude: number }[]
): Promise<RouteResponse> {
    const bufferSize = 0.0002

    const requestBody: any = {
        coordinates: [startCoords, endCoords],            
            extra_info: ["steepness","surface"],
            alternative_routes: {
                target_count: 3, //= reittivahtoehtojen määrä
                weight_factor: 1.6, //= kerroin, kuinka paljon pidempi saa reitti korkeintaan olla
                share_factor: 0.6 //= kerroin, kuinka paljon reitti korkeintaan saa mennä samaa tietä
            }
    }

    if (obstacles && obstacles.length > 0) {
        const polygons = obstacles.map((o) => ([
            [o.longitude-bufferSize, o.latitude-bufferSize],
            [o.longitude+bufferSize, o.latitude-bufferSize],
            [o.longitude+bufferSize, o.latitude+bufferSize],
            [o.longitude-bufferSize, o.latitude+bufferSize],
            [o.longitude-bufferSize, o.latitude-bufferSize]
        ]))
        requestBody.options = {
            avoid_polygons: {
                type: "MultiPolygon",
                coordinates: polygons.map(p => [p])
            },
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
    }

    const response = await fetch(`${BASE_URL}/v2/directions/wheelchair/geojson`, {
        method: 'POST',
        headers: {
            Authorization: process.env.EXPO_PUBLIC_ORS_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })

    const data = await response.json()

    if (!data.features || data.features.length === 0) {
        throw new Error('No route found')
    }
    
    const routes: RouteOption[] = data.features.map((feature: any) => ({
        coords: feature.geometry.coordinates.map(
            ([lon, lat]: [number, number]) => ({
            latitude: lat,
            longitude: lon
        }))
    }))

    const feature = data.features[0]

    // Jyrkkyys?
    const steepness = feature?.properties.extras?.steepness
    const summary = steepness?.summary?.[0]
    let steepnessSummaryValue = summary?.value ?? 0
    switch (steepnessSummaryValue) {
        case -5: steepnessSummaryValue = -16; break
        case -4: steepnessSummaryValue = -10; break
        case -3: steepnessSummaryValue = -7; break
        case -2: steepnessSummaryValue = -4; break
        case -1: steepnessSummaryValue = -1; break
        case 0: steepnessSummaryValue = 0; break
        case 1: steepnessSummaryValue = 1; break
        case 2: steepnessSummaryValue = 4; break
        case 3: steepnessSummaryValue = 7; break
        case 4: steepnessSummaryValue = 10; break
        case 5: steepnessSummaryValue = 16; break
    }

    // Tarkistus onko reitillä mukulakiveä
    const surface = feature?.properties.extras?.surface
    let hasCobblestone = false
    if (surface?.values) {
        hasCobblestone = surface.values.some(
            ([_, __, surfaceId]: [number, number, number]) => surfaceId === 14
        )
    }
    
    return {
        routes,
        steepnessSummaryValue,
        steepnessSummaryDistance: summary?.distance ?? 0,
        steepnessSummaryAmount: summary?.amount ?? 0,
        hasCobblestone
    }
}