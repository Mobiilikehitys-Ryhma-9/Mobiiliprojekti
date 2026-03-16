import { useEffect, useState } from 'react';

import { fetchRoute } from '../services/routeService';
import { RouteResponse } from '../types/route';

const API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY

//Testireitti Keskusta-alueella
const start: [number, number] = [25.470703, 65.010337]
const end: [number, number] = [25.470582, 65.012075]

export type Profile = 'foot-walking' | 'wheelchair'

export function useMap() {
    const [destination, setDestination] = useState<string>('')
    const [startCoords, setStartCoords] = useState<[number, number]>(start)
    const [endCoords, setEndCoords] = useState<[number, number]>(end)
    const [route, setRoute] = useState<RouteResponse | null>(null)
    const [profile, setProfile] = useState<Profile>('foot-walking')

    useEffect(() => {
        const getRoute = async () => {
            const data = await fetchRoute(profile, startCoords, endCoords)
            setRoute(data) 
        }
        getRoute()
    }, [startCoords, endCoords, profile])

    const geoCodeAddress = async () => {
        const response = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(destination)}`)
        const data = await response.json()
        if (data.features?.length > 0) {
          const [lon, lat] = data.features[0].geometry.coordinates
          setEndCoords([lon, lat])
        }
      }

    return { 
        destination, 
        setDestination,
        startCoords, 
        setStartCoords,
        endCoords, 
        setEndCoords, 
        route, 
        profile, 
        setProfile,
        geoCodeAddress
    } as const
}
