import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/theme-forms.css'

const Login = ({isUser}) => {
  const { register, handleSubmit,reset, formState: { errors, isSubmitting } } = useForm()

  const navigate = useNavigate();
  const onSubmit = async(data) => {
   console.log(data);
    try{
    const response = await axios.post('https://mitra-ul4i.onrender.com/api/auth/login',data,
      {
        withCredentials:true
    })
    const message = response.data;
    console.log(message);
     await isUser();
    reset();
   
    navigate('/')
  }
  catch(err){
    console.log(err.message);
  }

  }

  return (
    <div className="form-page">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2 className="form-title">Welcome back</h2>

        <label className="form-label" htmlFor="email">Email</label>
        <input
          id="email"
          className="form-input"
          placeholder="you@example.com"
          type="email"
          {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })}
        />
        {errors.email && <p className="form-error">{errors.email.message}</p>}

        <label className="form-label" htmlFor="password">Password</label>
        <input
          id="password"
          className="form-input"
          placeholder="Enter your password"
          type="password"
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
        />
        {errors.password && <p className="form-error">{errors.password.message}</p>}

        <button className="form-cta" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="form-foot">Don't have an account? <a href="/register">Register</a></p>
      </form>
    </div>
  )
}

export default Login
