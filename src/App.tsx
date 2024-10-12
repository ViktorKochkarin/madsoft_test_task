import {FunctionComponent} from "react";
import Test from "./Test";
import {questions} from "./mock";

const App: FunctionComponent = () => {
    return (
        <Test questions={questions} timelimit={600}/>
    )
}

export default App;