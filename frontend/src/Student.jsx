import { useState } from "react";
function Student() {
    const [age, setAge] = useState(10)
    return (
        <div>
            <h1>Student Details</h1>
            <h2>Age: {age}</h2>
            <button onClick={() => setAge(age + 3)}>Increase Age</button>
        </div>
    )
}

export default Student;