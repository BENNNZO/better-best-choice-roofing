
'use client'

import { useState, useEffect } from "react"
// import { motion, useMotionValue } from "framer-motion"

export default function App() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // const x = useMotionValue(0)

    if (isMounted) {
        return (
            <section className="w-full h-full rounded-b-[45px] rounded-t-xl snap-center flex-none overflow-hidden" id="app" >
                <iframe 
                    src="https://app.bestchoiceroofing.com" 
                    className="w-full h-full"
                    allow="*"
                >
                    <p>Your browser does not support iframes.</p>
                </iframe>
            </section>
        )
    } else {
        return null
    }
}