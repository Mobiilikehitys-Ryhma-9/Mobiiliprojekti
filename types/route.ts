import { LatLng } from "react-native-maps"

export type RouteResponse = {
    routeCoords: LatLng[]
    elevation: number
}