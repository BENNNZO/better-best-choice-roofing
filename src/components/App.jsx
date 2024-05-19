'use client'

import { motion, useMotionValue } from "framer-motion"

export default function App() {
    const x = useMotionValue(0)

    return (
        <motion.section className="w-full h-full rounded-b-[45px] rounded-t-xl snap-center flex-none overflow-hidden" id="app" >
            <iframe 
                src="https://app.bestchoiceroofing.com" 
                className="w-full h-full"
                allow="*"
            >
                <p>Your browser does not support iframes.</p>
            </iframe>
        </motion.section>
    )
}