"use client"

import tt from "@tomtom-international/web-sdk-maps";
import { useEffect, useState } from "react"

export default function Home() {
    const [geoPoints, setGeoPoints] = useState([
        // low density
        [-82.01853054100553, 33.48448547456728],
        [-82.03410995735028, 33.48227540342816],
        [-82.02978641731535, 33.508930511004394],
        [-82.00677900784427, 33.47892683884362],
        [-82.02792618454858, 33.493911700774746],
        // low density
        [0.035866315266076754, 51.50530882642349],
        [0.037239606276585846, 51.50530882642349],
        // medium density
        [0.04410606135789408, 51.60606293106869],
        [0.06813865412814835, 51.6009452260123],
        [0.05028587092436965, 51.596253489653066],
        [0.026939923659398346, 51.59412072198555],
        [0.04822593439902789, 51.58729519243778],
        [0.0598989080363026, 51.58516200412868],
        // high density
        [-0.1484370070708394, 51.51355434335747],
        [-0.14116666086630403, 51.516268992925035],
        [-0.14698293783399663, 51.50857706561709],
        [-0.1389855570008649, 51.512649424212185],
        [-0.1484370070708394, 51.51581656256633],
        [-0.1542532840487354, 51.51400679618595],
        [-0.17024804570488072, 51.516268992925035],
        [-0.16006956101645642, 51.50857706561709],
        [-0.13389631465156526, 51.510387047712356],
        [-0.11281231063600217, 51.51807866942707]
    ])

    useEffect(() => {
        const map = tt.map({
            key: process.env.NEXT_PUBLIC_TT_SK,
            container: 'map',
            center: [-81.97483750375089, 33.468953974764304],
            zoom: 8
        })

        // GOTO LOCATION ON MAP BUTTON
        map.addControl(new tt.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        }))

        // SHOW COORDS ON SCREEN CLICK
        map.on('click', function (event) {
            setGeoPoints(e => {
                let updatedArray = [...e, [event.lngLat.lng, event.lngLat.lat]]

                map.getSource('heatmap-data').setData({
                    type: 'FeatureCollection',
                    features: updatedArray.map(function (point) {
                        return {
                            geometry: {
                                type: 'Point',
                                coordinates: point
                            },
                            properties: {}
                        }
                    })
                })

                return updatedArray
            })
            
            // let lngLat = new tt.LngLat(event.lngLat.lng, event.lngLat.lat);
            // 
            // new tt.Popup({ className: 'tt-popup' })
            //     .setLngLat(lngLat)
            //     .setHTML(lngLat.toString())
            //     .addTo(map);
        })

        // HEATMAP LAYER
        map.on('load', function () {
            map.addSource('heatmap-data', {
                'type': 'geojson',
                'data': {
                    type: 'FeatureCollection',
                    features: geoPoints.map(function (point) {
                        return {
                            geometry: {
                                type: 'Point',
                                coordinates: point
                            },
                            properties: {}
                        }
                    })
                }
            })

            map.addLayer({
                'id': 'heatmap',
                'type': 'heatmap',
                'source': 'heatmap-data',
                'paint': {
                    // Increase the heatmap weight of each point
                    'heatmap-weight': 0.6,
                    // Increase the heatmap color weight weight by zoom level
                    // heatmap-intensity is a multiplier on top of heatmap-weight
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0, 1,
                        9, 3
                    ],
                    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    // Begin color ramp at 0-stop with a 0-transparancy color
                    // to create a blur-like effect.
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0, 'rgba(49, 150, 251, 0)',
                        0.2, 'rgb(49, 150, 251)',
                        0.4, 'rgb(127, 234, 20)',
                        0.6, 'rgb(251, 251, 49)',
                        0.8, 'rgb(251, 150, 49)',
                        1, 'rgb(251, 49, 49)'
                    ],
                    // Adjust the heatmap radius by zoom level
                    'heatmap-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0, 2,
                        4, 20 // at zoom level 9 the radius will be 20px
                    ]
                }
            })
        })
    }, [])

    return (
        <main className="bg-zinc-900 p-2 h-screen flex flex-row gap-2">
            {/* <iframe src="https://example.com" className="w-full rounded-lg">
                <p>Your browser does not support iframes.</p>
            </iframe>
            <iframe src="https://example.com" className="w-full rounded-lg">
                <p>Your browser does not support iframes.</p>
            </iframe> */}
            <div id="map" className="w-full rounded-md">

            </div>
            {/* <p className="w-1/2 font-mono text-white">
                {JSON.stringify(geoPoints, null, 4)}
            </p> */}
        </main>
    );
}