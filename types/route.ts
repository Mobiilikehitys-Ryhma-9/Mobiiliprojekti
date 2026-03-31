export type RoutePoint = {
    start: [number, number]
    end: [number, number]
}

export type RouteOption = {
    coords: { latitude: number, longitude: number }[]
}

export type RouteResponse = {
    routes: RouteOption[]
    steepnessSummaryValue: number
    steepnessSummaryDistance: number
    steepnessSummaryAmount: number
}