export type RoutePoint = {
    start: [number, number]
    end: [number, number]
}

export type RouteOption = {
    coords: { latitude: number, longitude: number }[]
    steepnessSummaryValue: number
    steepnessSummaryDistance: number
    steepnessSummaryAmount: number
    waytype: string
}

export type RouteResponse = {
    routes: RouteOption[]
}