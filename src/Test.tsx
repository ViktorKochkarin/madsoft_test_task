import {FunctionComponent, useCallback, useEffect, useState} from 'react'
import './App.css'
import {Button, MobileStepper, Stack, Typography} from "@mui/material";
import Timer from "./Timer";
import {renderQuestion} from "./utils";
import {useCookies} from "react-cookie";
import {questions} from "./mock";

interface TestProps {
    timelimit?: number //seconds
    questions: any[]
}

const Test: FunctionComponent<TestProps> = (props) => {
    const [cookies, setCookie, removeCookie]= useCookies(['answers', 'currentQuestion', 'sent', 'timeUp', 'timeLeft'])
    const [currentAnswer, setCurrentAnswer] = useState(undefined)

    useEffect(() => {
        if(cookies.answers === undefined) {
            setCookie('answers', {})
        }
        if(cookies.currentQuestion === undefined){
            setCookie('currentQuestion', 0)
        }
        if(cookies.sent === undefined) {
            setCookie('sent', false)
        }
        if(cookies.sent === undefined) {
            setCookie('timeUp', false)
        }
        if(cookies.currentQuestion === questions.length && cookies.sent !== true    ) {
            console.log(`Send answers`, cookies.answers)
            setCookie('sent', true)
        }
    }, [cookies])

    const onAnswer = () => {
        setCookie('currentQuestion', cookies.currentQuestion + 1)
        setCookie('answers', {
            ...cookies.answers,
            [cookies.currentQuestion]: currentAnswer
        })
        setCurrentAnswer(undefined)
    }

    const clear = useCallback(() => {
        removeCookie('currentQuestion')
        removeCookie('answers')
        removeCookie('sent')
        removeCookie('timeLeft')
    }, [cookies])

    if(cookies.timeUp) {
        return(
            <>
                <div>Время вышло!</div>
                <Button onClick={clear}>Clear</Button>
            </>
        )
    }

    if(cookies.currentQuestion >= questions.length) {
        return(
            <>
                <div>Тест пройден!</div>
                <Button onClick={clear}>Clear</Button>
            </>
        )
    }

    return (
        <div className={'test-area'}>
            <Stack direction={'column'}>
                <Stack direction={'column'} className={'header'}>
                    <Stack direction={'row'} spacing={2}>
                        <Typography variant="h3" component="h2">
                            Тестирование
                        </Typography>
                        {
                            props?.timelimit ? <Timer timeout={props?.timelimit} onTimeUp={() => setCookie('timeUp', true)}/> : null
                        }
                    </Stack>
                    <MobileStepper
                        variant="dots"
                        steps={props.questions.length}
                        position="static"
                        activeStep={cookies.currentQuestion}
                        sx={{ maxWidth: 400, flexGrow: 1 }}
                    />
                </Stack>
                {
                    renderQuestion(props.questions[cookies?.currentQuestion || 0], setCurrentAnswer)
                }
                <Button onClick={onAnswer} disabled={currentAnswer === undefined}>Далее</Button>
                <Button onClick={clear}>Clear</Button>
            </Stack>
        </div>
    )
}
export default Test;