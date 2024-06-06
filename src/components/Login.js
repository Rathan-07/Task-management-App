import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import validator from 'validator'; // Import validator if it's used
import _ from 'lodash'; // Import lodash if it's used
import { useAuth } from "./context/AuthContext";
import { Link } from "react-router-dom";


export default function Login() {
    const navigate = useNavigate();
    const { dispatch } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        serverErrors: null,
        clientErrors: {}
    });

    const runValidations = () => {
        const errors = {};
        if (formData.email.trim().length === 0) {
            errors.email = 'Email is required';
        } else if (!validator.isEmail(formData.email)) {
            errors.email = 'Invalid email format';
        }
        if (formData.password.trim().length === 0) {
            errors.password = 'Password is required';
        } else if (formData.password.trim().length < 8 || formData.password.trim().length >= 128) {
            errors.password = 'Password must be between 8 to 128 characters';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = _.pick(formData, ['email', 'password']); // Corrected object name
        const errors = runValidations();
        if (Object.keys(errors).length === 0) {
            try {
                const response = await axios.post('http://localhost:3070/users/login', form);
                localStorage.setItem('token', response.data.token);
                const userResponse = await axios.get('http://localhost:3070/users/account', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                dispatch({ type: "LOGIN", payload: { account: userResponse.data } });
                navigate('/');
            } catch (err) {
                setFormData({ ...formData, serverErrors: err.response.data.errors, clientErrors: {} });
            }
        } else {
            setFormData({ ...formData, clientErrors: errors });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    
    const displayErrors = () => {
        if (typeof formData.serverErrors === 'string') {
            return <p>{formData.serverErrors}</p>;
        } else if (Array.isArray(formData.serverErrors)) {
            return (
                <div>
                    <h3>These errors prohibited the form from being saved:</h3>
                    <ul>
                        {formData.serverErrors.map((error, index) => (
                            <li key={index}>{error.msg}</li>
                        ))}
                    </ul>
                </div>
            );
        }
        return null;
    };
    
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
            { formData.serverErrors && displayErrors() } 
                <label htmlFor="email">Email:</label><br />
                <input
                    type="text"
                    value={formData.email}
                    id="email"
                    name="email"
                    onChange={handleChange}
                />
                {formData.clientErrors.email && <div>{formData.clientErrors.email}</div>}
                <br />
                <label htmlFor="password">Password:</label><br />
                <input
                    type="password"
                    value={formData.password}
                    id="password"
                    name="password"
                    onChange={handleChange}
                />
                {formData.clientErrors.password && <div>{formData.clientErrors.password}</div>}
                <br />
                <input type="submit" />
            </form>
            <Link to="/register">Create an account</Link>
        </div>
    );
}

