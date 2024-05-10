"use client"

import tt from "@tomtom-international/web-sdk-maps";
import { useEffect } from "react"

export default function Home() {
    useEffect(() => {
        const map = tt.map({
            key: process.env.TOMTOM_KEY,
            container: 'map'
        });

        setTimeout(() => {
            var marker = new tt.Marker().setLngLat([30.5, 50.5]).addTo(map);
            marker.togglePopup()
            map.addControl(new tt.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }));
        }, 1000);
    }, [])

    return (
        <main className="bg-zinc-900 p-2 h-screen flex flex-row gap-2">
            {/* <iframe src="https://example.com" className="w-full rounded-lg">
                <p>Your browser does not support iframes.</p>
            </iframe>
            <iframe src="https://example.com" className="w-full rounded-lg">
                <p>Your browser does not support iframes.</p>
            </iframe> */}
            <div id="map" className="w-full h-full rounded-md">

            </div>
        </main>
    );
}
