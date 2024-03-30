'use client'
import Layout from "./layout";
import Link from "next/link";
import {useState} from "react";
import Image from "next/image";

export default function Register(){
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirm_password: ""
    })
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        setErrors({...errors, [e.target.name]: ""})
    }
    const validateForm = () => {
        const {username, password, confirm_password} = formData;

        const newErrors = {};

        if (!username.trim()) {
            newErrors.username = "Username contains space";
        }
        if ((username.trim().length < 3)) {
            console.log(username.trim().length > 3)
            newErrors.username = "Username is less than 3 letters";
        }
        //TODO: Username is unique
        if(password.trim()){
            newErrors.password = "Password contains spaces"
        }
        if(!(password.trim().length < 6)){
            newErrors.password = "Password is less than 6 letters"
        }
        if (!/[A-Z]/.test(password)) {
            newErrors.password = "Password must contain an uppercase letter";
        }
        // Vérifier s'il y a un caractère spécial dans le mot de passe
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            newErrors.password = "Password must contain a special character";
        }
        if(password !== confirm_password){
            newErrors.password = "Confirm password is not equal to password"
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(validateForm()){
            try {
                // Envoyer la requête ici
                console.log("Formulaire soumis :", formData);
            } catch (error) {
                console.error("Erreur lors de l'envoi du formulaire :", error);
            }
        }
    }
    const showPasswordHandler = (e) => {
        if(e.target.alt === 'show-password'){
            setShowPassword(!showPassword)
            if (!showPassword){
                e.target.closest('div').children[0].type = 'text'
            }
            else{
                e.target.closest('div').children[0].type = 'password'
            }
        }
        else if(e.target.alt === 'show-confirm_password'){
            setShowConfirmPassword(!showConfirmPassword)
            if (!showConfirmPassword){
                e.target.closest('div').children[0].type = 'text'
            }
            else{
                e.target.closest('div').children[0].type = 'password'
            }
        }
    }
    return (
        <Layout>
            <main className="bg-slate-800 h-dvh flex justify-center items-center">
                <div className="flex flex-col items-center gap-10 bg-slate-700 p-12 rounded-lg">
                    <p className="text-white font-bold text-3xl">Register</p>
                    <form className="flex flex-col justify-center items-center gap-3" onSubmit={handleSubmit}>
                        <div className="flex flex-col items-center">
                            <label htmlFor="username" className="text-white text-lg">Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} className="text-center rounded-lg p-1"/>
                            <p className="text-red-500">{errors.username}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <label htmlFor="password" className="text-white text-lg">Password</label>
                            <div className="relative">
                                <input type="password" name="password" className="text-start rounded-lg p-1 pr-7"/>
                                <Image onClick={showPasswordHandler} src={`${!showPassword ? "../images/eye.svg" : "../images/eye-slash.svg"}`} alt="show-password" height="100" width="0" className="h-6 w-auto absolute top-1 right-1 cursor-pointer"/>
                            </div>
                            <p className="text-red-500">{errors.password}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <label htmlFor="password" className="text-white text-lg">Confirm password</label>
                            <div className="relative">
                                <input type="password" name="password" className="text-start rounded-lg p-1 pr-7"/>
                                <Image onClick={showPasswordHandler}
                                       src={`${!showConfirmPassword ? "../images/eye.svg" : "../images/eye-slash.svg"}`}
                                       alt="show-confirm_password" height="100" width="0"
                                       className="h-6 w-auto absolute top-1 right-1 cursor-pointer"/>
                            </div>
                            <p className="text-red-500">{errors.confirm_password}</p>
                        </div>
                        <input type="submit" value="Register"
                               className="bg-sky-700 text-white px-5 py-1 rounded-lg cursor-pointer"/>
                    </form>
                    <p className="text-white">Already registered ? Log to your account <Link href="/login"><span
                        className="text-sky-400 underline underline-offset-4">here</span></Link></p>
                </div>
            </main>
        </Layout>
    )
}