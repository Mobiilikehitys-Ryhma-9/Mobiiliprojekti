import { useState } from 'react';

import { fetchFootwalkRoute, fetchWheelchairRoute } from '../services/routeService';
import { RoutePoint, RouteResponse } from '../types/route';
import { MapPin } from "../types/Pin";

const API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY

//Testireitti Keskusta-alueella
const start: [number, number] = [25.470703, 65.010337]
const end: [number, number] = [25.470582, 65.012075]

export type Profile = 'foot-walking' | 'wheelchair'

export function useMap() {
    const [startLocation, setStartLocation] = useState<string>('')
    const [destination, setDestination] = useState<string>('')
    const [routePoints, setRoutePoints] = useState<RoutePoint | null>(null)
    const [route, setRoute] = useState<RouteResponse | null>(null)
    const [profile, setProfile] = useState<Profile>('foot-walking')
    const [obstaclePins, setObstaclePins] = useState<MapPin[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [routeWarning, setRouteWarning] = useState<string | null>(null)

    const handleRouteSearch = async () => {
        setLoading(true)
        setRouteWarning(null)
        const start = await geoCodeAddress(startLocation)
        const end = await geoCodeAddress(destination)
        
        try {
            if (!start || !end) return
            
            let data: RouteResponse
            setRoutePoints({ start, end })

            if (profile === 'foot-walking') {
                data = await fetchFootwalkRoute(start, end)
                setRoute(data)
            } else if (profile === 'wheelchair') {
                try {
                    data = obstaclePins?.length 
                        ? await fetchWheelchairRoute(start, end, obstaclePins)
                        : await fetchWheelchairRoute(start, end)
                    setRoute(data)
                } catch (err) {
                    console.log('Wheelchair route fetch failed, falling back to walking route')
                    data = await fetchFootwalkRoute(start, end)
                    setRoute(data)
                    setRouteWarning('Esteetöntä reittiä pyörätuolille ei löytynyt. Näytetään kävelyreitti.')
                }
            }
        } catch (err) {
            console.error('Route search exception:', err)
            setRouteWarning('Reitin haku epäonnistui')
        } finally {
            setLoading(false)
        }
    }

    const geoCodeAddress = async (
        address: string
    ): Promise<[number, number] | null> => {
        try {
            const response = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(address)}`)
            const data = await response.json()
            if (data.features?.length > 0) {
                const [lon, lat] = data.features[0].geometry.coordinates
                return [lon, lat]
            }
            return null
        } catch (err) {
            console.error('Geocode error:', err)
            return null
        }
    }
    
    return { 
        startLocation,
        setStartLocation,
        destination, 
        setDestination,
        routePoints,
        route,
        profile,
        setProfile,
        obstaclePins,
        setObstaclePins,
        handleRouteSearch,
        loading,
        routeWarning
    } as const
}