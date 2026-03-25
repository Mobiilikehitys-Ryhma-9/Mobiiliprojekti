import { LatLng } from "react-native-maps"

export type RoutePoint = {
    start: [number, number]
    end: [number, number]
}

export type RouteResponse = {
    routeCoords: LatLng[]
    steepnessValues: number[]
    steepnessSummaryValue: number
    steepnessSummaryDistance: number
    steepnessSummaryAmount: number
}