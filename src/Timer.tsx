import {FunctionComponent, useEffect, useState} from "react";
import './test.scss'
import {useCookies} from "react-cookie";

interface TimerProps {
    timeout: number //
    onTimeUp: Function
}

function formatTimeout(timeout: number) {
    const minutes = (Math.floor(timeout/60) + '').padStart(2, '0')
    const seconds = (timeout%60 + '').padStart(2, '0')
    return `${minutes}:${seconds}`
}

const Timer: FunctionComponent<TimerProps> = (props) => {
    const [cookies, setCookie, removeCookie]= useCookies(['timeLeft'])
    const [timeLeft, setTimeLeft] = useState(0)
    const [intervalId, setIntervalId] = useState<number | null>(null)

    useEffect(() => {
        if(cookies.timeLeft !== undefined) {
            setTimeLeft(cookies.timeLeft)
        }
        else {
            setTimeLeft(props.timeout)
        }
        if(intervalId == null) {
            const inter = setInterval(() => {
                setTimeLeft(prevState => prevState - 1)
            }, 1000)

            setIntervalId(inter)
        }
    }, [props.timeout])

    useEffect(() => {
        setCookie('timeLeft', timeLeft)
        if(timeLeft <= 0 && intervalId !== null) {
            clearInterval(intervalId)
            setTimeLeft(0)
            props.onTimeUp()
        }
    }, [timeLeft])

    return(
        <div className={'timer'}>{formatTimeout(timeLeft)}</div>
    )
}

export default Timer;