function StudentForm() {
    return (
        <div>
            <h1>Student Form</h1>
            <form>
                <label>Name</label>
                <input type="text" placeholder="Enter your name" />
                <br></br>
                <label>email</label>
                <input type="email" placeholder="Enter your email" />
                <br></br>
                <label>Password</label>
                <input type="password" placeholder="Enter your password" />
                <br></br>
                <label>Upload File</label>
                <input type="file" />
                <br></br>
                <button>Register</button>
            </form>
        </div>
    )
}

export default StudentForm;