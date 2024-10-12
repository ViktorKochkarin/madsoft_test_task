import {FunctionComponent, useEffect, useState} from "react";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from "@mui/material";

export const renderQuestion = (question: Question, onAnswer: Function) => {
    switch (question.type) {
        case "short":
        case "long":
            return <FreeAnswerQuestion question={question} onAnswer={onAnswer}/>
        case "single_choice":
            return <SingleOptionQuestion question={question} onAnswer={onAnswer}/>
        case 'multiple_choice':
            return <MultipleOptionsQuestion question={question} onAnswer={onAnswer}/>
        default:
            return null
    }
}

type QuestionProps = {
    question: Question
    onAnswer: Function
}


const FreeAnswerQuestion: FunctionComponent<QuestionProps> = ({question, onAnswer}) => {
    return(
        <Stack direction={'column'}>
            <Typography variant="h6" component="h6">
                {question.text}
            </Typography>
            <TextField
                onChange={event => {
                    onAnswer(event.target.value)
                }}
                id="outlined-multiline-flexible"
                label="Ответ"
                multiline={question?.type === 'long'}
                slotProps={{
                    input: {
                        maxLength: question?.type === 'short' ? 40 : 300
                    }
                }}
                maxRows={question?.type == 'short' ? 1 : 4}
            />
        </Stack>
    )
}

const SingleOptionQuestion: FunctionComponent<QuestionProps> = ({question, onAnswer}) => {
    if(!question?.options || question?.options?.length == 0) return null;

    return(
        <Stack direction={'column'}>
            <Typography variant="h6" component="h6">
                {question.text}
            </Typography>
            <FormControl>
                <RadioGroup
                    onChange={(event, value) => {
                        onAnswer(value)
                    }}
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                >
                    {
                        question?.options?.map(option => <FormControlLabel key={option} value={option} control={<Radio />} label={option} />)
                    }
                </RadioGroup>
            </FormControl>
        </Stack>
    )
}

const MultipleOptionsQuestion: FunctionComponent<QuestionProps> = ({question, onAnswer}) => {
    if(!question?.options || question?.options?.length == 0) return null;
    const [checked, setChecked] = useState<string[]>([])

    useEffect(() => {
        onAnswer(checked)
    }, [checked])

    return(
        <Stack direction={'column'}>
            <Typography variant="h6" component="h6">
                {question.text}
            </Typography>
            <FormControl>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                >
                    {
                        question?.options?.map(option =>
                            <FormControlLabel
                                key={option}
                                value={option}
                                control={
                                    <Checkbox
                                        checked={checked.includes(option)}
                                        name={option}
                                        onChange={(event) => {
                                            if(event.target.checked) {
                                                setChecked(prevState => [...prevState, event.target.value])
                                            }
                                            else {
                                                setChecked(prevState => prevState.filter(e => e !== event.target.value))
                                            }
                                        }}
                                    />
                                }
                                label={option}
                            />
                        )
                    }
                </RadioGroup>
            </FormControl>
        </Stack>
    )
}