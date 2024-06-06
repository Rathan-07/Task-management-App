import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import validator from 'validator'; 


export default function Register(){
    const navigate = useNavigate()
    const [formData,setFormData] = useState({
        username:'',
        email:'',
        password:'',
        role:'',
        usernameErr:'',
        useremailErr:'',
        userpassErr:'',
        userErrRole:'',
        clientErrors: {},
    })
    const runValidations = ()=>{
        const errors = {}
        if(formData.username.trim().length === 0){
            errors.username  = 'username is required'
        }
        if(formData.email.trim().length === 0){
            errors.email = 'Email is required'
        }
        else if(!validator.isEmail(formData.email)){
           errors.email = 'invalid format'
        }
        if(formData.password.trim().length === 0){
            errors.password = 'Password is required';
        }
        else if(formData.password.trim().length <=8 || formData.password.trim().length >=128){
            errors.password = 'Password must be between 8 to 128 characters'
        }
        if(formData.role.trim().length === 0 ){
            errors.role = 'Role is required';
        }
        return errors; 
    }
    const handleChange = (e)=>{
        const {name,value} = e.target
        setFormData({...formData,[name]:value})
    }
    const handleCheckEmail = async () => {
        if (validator.isEmail(formData.email)) { 
            try {
                const response = await axios.get(`http://localhost:3070/users/checkemail?email=${formData.email}`);
                // console.log(response);
                if (response.data.is_registered_email) {
                    setFormData({ ...formData, clientErrors: { ...formData.clientErrors, email: 'Email is already registered' } });
                }
            } catch (error) {
                console.error(error);
            }
        }
    };
    

    const handleSubmit = async (e)=>{
        e.preventDefault()
        const clientErrors = runValidations()
        setFormData({...formData,clientErrors})
        if(Object.keys(clientErrors).length === 0){
            try {
                const response = await axios.post('http://localhost:3070/users/register',formData)
                console.log(response.data)
                navigate('/login')

            }
            catch (err) {
                if (err.response && err.response.data && err.response.data.errors) {
                    const errors = err.response.data.errors;
                    console.log(errors);
                    const usernameError = errors.find((ele) => ele.path === 'username');
                    const userEmailError = errors.find((ele) => ele.path === 'email');
                    const userpassErr = errors.find((ele) => ele.path === 'password');
                    const roleErr = errors.find((ele) => ele.path === 'role');

                    setFormData({
                        ...formData,
                        usernameErr: usernameError ? usernameError.msg : '',
                        useremailErr: userEmailError ? userEmailError.msg : '',
                        userpassErr: userpassErr ? userpassErr.msg : '',
                        userErrRole: roleErr ? roleErr.msg : ''
                    });
                } else {
                    console.error(err);
                }
            }
            
        }
    }
    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label>Enter username</label><br />
                <input type="text"
                id="username"
                value={formData.username}
                name="username"
               
                onChange={handleChange}
                />
                {formData.clientErrors['username'] && <span>{formData.clientErrors['username']}</span>}
                {formData.usernameErr && <span>{formData.usernameErr}</span>}
                <br />

                <label>Enter email</label><br />
                <input type="text"
                id="email"
                value={formData.email}
                name="email"
                onChange={handleChange}
                onBlur={handleCheckEmail}
                />
                 {formData.clientErrors['email'] && <span>{formData.clientErrors['email']}</span>}
                {formData.useremailErr && <span>{formData.useremailErr}</span>}
                <br />

                <label>Enter password</label><br />
                <input type="password"
                id="password"
                value={formData.password}
                name="password"
                onChange={handleChange}
                />
                 {formData.clientErrors['password'] && <span>{formData.clientErrors['password']}</span>}
                {formData.userpassErr && <span>{formData.userpassErr}</span>}
                <br />

                <label htmlFor="role"></label>
                <input type="radio"
                id="user"
                value='user' 
                name="role"
                checked = {formData.role === 'user'}
                onChange={handleChange}
                />
                <label htmlFor="user">user</label>
                {formData.userErrRole && <span style={{ marginLeft: '20px' }}>{formData.userErrRole}</span>}
                {formData.clientErrors['role'] && <span style={{ marginLeft: '20px' }}>{formData.clientErrors['role']}</span>}
                <br />
                <input type="submit" />

            </form>
        </div>
    )
}