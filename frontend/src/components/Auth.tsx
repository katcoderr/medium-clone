import { SignupInput } from "@katcoder/medium-common"
import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { BACKEND_URL } from "../config"

export const Auth = ({type} : {type : "signup" | "signin"})=>{
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name : "",
        email : "",
        password : ""
    })
    
    const navigate = useNavigate()

    async function sendRequest(){
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,postInputs)
            const jwt = response.data.jwt
            localStorage.setItem("token", jwt)
            navigate("/blogs")
        } catch (e) {
            alert("Error!")
        }
        
    }

    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
            <div>
            <div className="text-3xl font-extrabold">
                Welcome Back!

            </div>
            <div className="text-slate-400">
    {type === "signup" ? "Already have an account?" : "Dont have an account?"}
    <Link className="pl-2 underline" to={type ==="signin" ? "/signup" : "/signin"}>{type === "signin" ? "Sign up" : "Login"}</Link>
            </div>
            </div>
            <div>
        {type === "signup" ? <LabelledInput label="Name" placeholder="John Doe" onChange={(e)=>{
            setPostInputs({
                ...postInputs,
                name : e.target.value
            })

        }} /> : null }

<LabelledInput label="Username" placeholder="username@example.com" onChange={(e)=>{
            setPostInputs({
                ...postInputs,
                email : e.target.value
            })

        }} />

<LabelledInput label="Password" type="password" placeholder="Password" onChange={(e)=>{
            setPostInputs({
                ...postInputs,
                password : e.target.value
            })

        }} />

<button onClick={sendRequest} type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-full mt-2">{type === "signin" ? "Sign In" : "Sign Up"}</button>

        </div>
        </div>
        </div>
    </div>
}

interface LabelledInputType {
    label : string,
    placeholder : string,
    onChange : (e : ChangeEvent<HTMLInputElement>) => void,
    type? : string
}

export function LabelledInput({label, placeholder, onChange, type} : LabelledInputType) {
    return <div>
    <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black mt-2">{label}</label>
    <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required />
</div>
}