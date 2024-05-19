"use client"

import { useState, useEffect } from "react"

export default function Map() {
    const [toggleHeatmap, setToggleHeatmap] = useState(true)
    const [mapHamburger, setMapHamburger] = useState(false)
    const [mapObject, setMapObject] = useState(null)
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

    function setHeatmapData(pointsArray, map) {
        map.getSource('heatmap-data').setData({
            type: 'FeatureCollection',
            features: pointsArray.map(function (point) {
                return {
                    geometry: {
                        type: 'Point',
                        coordinates: point
                    },
                    properties: {}
                }
            })
        })
    }

    useEffect(() => {
        async function initMap() {
            const tt = await import('@tomtom-international/web-sdk-maps')

            const map = tt.map({
                key: process.env.NEXT_PUBLIC_TT_SK,
                container: 'map',
                center: [-81.97483750375089, 33.468953974764304],
                zoom: 10,
                style: "/map_style.json"
            })

            // GOTO LOCATION ON MAP BUTTON
            map.addControl(new tt.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true
            }))
    
            // ADD HEATMAP POINT ON CLICK
            map.on('click', function (event) {
                setGeoPoints(e => {
                    let updatedArray = [...e, [event.lngLat.lng, event.lngLat.lat]]
    
                    setHeatmapData(updatedArray, map)
    
                    return updatedArray
                })
            })
    
            // HEATMAP LAYER
            map.on('load', function () {
                setMapObject(map)
    
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
        }
        // had to use this work around for client side imports cause it kept throwing a self is undefined error when building.
        initMap()
    }, [])

    return (
        <section className="w-full h-full flex flex-col gap-2 rounded-b-[45px] rounded-t-xl overflow-hidden snap-center flex-none">
            <div id="map" className="w-full h-full rounded-md">
                <div className="bg-zinc-800 w-10 h-10 shadow-md absolute bottom-2 right-2 rounded-md z-50" onClick={() => setMapHamburger(e => !e)}>
                    <div className={`w-6 h-0.5 rounded-full bg-zinc-200 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 duration-100 ${mapHamburger ? "top-1/2 rotate-45" : "top-[calc(50%-0.5rem)] rotate-0"}`}></div>
                    <div className={`w-6 h-0.5 rounded-full bg-zinc-200 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 duration-100 ${mapHamburger ? "opacity-0 top-[calc(50%-0rem)]" : "top-[calc(50%-0rem)]"}`}></div>
                    <div className={`w-6 h-0.5 rounded-full bg-zinc-200 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 duration-100 ${mapHamburger ? "top-1/2 -rotate-45" : "top-[calc(50%+0.5rem)] rotate-0"}`}></div>
                    {
                        mapHamburger ? (
                            <ol className="pop-in absolute bottom-full right-0 flex flex-col mb-2 rounded-md overflow-hidden">
                                <li className="relative bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-sans text-base whitespace-nowrap">
                                    <button className="px-4 py-2 w-full h-full" onClick={e => {
                                        e.preventDefault()

                                        setToggleHeatmap(e => {
                                            setHeatmapData(!e ? geoPoints : [], mapObject)
                                            return !e
                                        })
                                    }}>
                                        Toggle Heat Map
                                    </button>
                                </li>
                                <li className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-sans text-base whitespace-nowrap">
                                    <button className="px-4 py-2 w-full h-full">
                                        Add New Point
                                    </button>
                                </li>
                            </ol>
                        ) : (
                            ""
                        )
                    }
                </div>
            </div>
            <button className="h-24 w-full rounded-md relative overflow-hidden">
                <a href="#app" className="w-full h-full bg-zinc-800 grid place-items-center">
                    <img src="/arrow.svg" alt="go back to BCR app" className="h-12 invert opacity-50 rotate-180" /> 
                </a>
            </button>
        </section>
    )
}