import { useEffect, useState } from 'react';

import { fetchRoute } from '../services/routeService';
import { RoutePoint, RouteResponse } from '../types/route';

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
    const [loading, setLoading] = useState<boolean>(false)

    const handleRouteSearch = async () => {
        setLoading(true)
        try {
            const start = await geoCodeAddress(startLocation)
            const end = await geoCodeAddress(destination)

            if (!start || !end) return

            setRoutePoints({ start, end })

            const data = await fetchRoute(profile, start, end)
            setRoute(data)
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
        handleRouteSearch,
        loading
    } as const
}
