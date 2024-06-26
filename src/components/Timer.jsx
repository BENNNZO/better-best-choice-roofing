'use client'

import { useState, useEffect } from "react"
import { CountdownCircleTimer } from "react-countdown-circle-timer"

export default function Timer() {
    const [running, setRunning] = useState(false)
    const [pingSFX, setPingSFX] = useState(null)
    
    useEffect(() => {
        setPingSFX(new Audio('/ping.mp3'))
    }, [])

    return (
        <section id="timer" className="w-full h-full rounded-b-[45px] rounded-t-xl bg-zinc-800 drop-shadow-md grid place-items-center text-3xl font-bold text-white flex-none snap-center">
            {
                running ? (
                    <div className="pop-in font-mono">
                        <CountdownCircleTimer
                            isPlaying
                            key={running}
                            duration={30}
                            colors={['#34eb3d', '#F7B801', '#A30000', '#A30000']}
                            colorsTime={[30, 20, 10, 0]}
                            strokeWidth={16}
                            trailColor="rgba(255, 255, 255, 0.2)"
                            onComplete={() => {
                                pingSFX.play()
                                setRunning(false)
                            }}
                        >
                            {({ remainingTime }) => remainingTime}
                        </CountdownCircleTimer>
                    </div>
                ) : (
                    <button onClick={() => setRunning(true)} className="bg-zinc-600 rounded-md px-4 py-2 pop-in">
                        START TIMER
                    </button>
                )
            }
        </section>
    )
}