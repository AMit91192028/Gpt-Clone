import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios';
import '../styles/theme-forms.css'

const Register = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const onSubmit = async(data) => {
    // placeholder submit handler
    const info = {
      fullName:{
        firstName:data.firstname,
        lastName:data.lastname
      },
      email:data.email,
      password:data.password
    }
   const response = await axios.post('http://localhost:3000/api/auth/register',info,{withCredentials:true})
    const message = response.data;
    console.log(message);
  }

  return (
    <div className="form-page">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2 className="form-title">Create account</h2>

        <label className="form-label" htmlFor="firstname">First name</label>
        <input id="firstname" className="form-input" placeholder="First name" {...register('firstname', { required: 'First name is required' })} />
        {errors.firstname && <p className="form-error">{errors.firstname.message}</p>}

        <label className="form-label" htmlFor="lastname">Last name</label>
        <input id="lastname" className="form-input" placeholder="Last name" {...register('lastname', { required: 'Last name is required' })} />
        {errors.lastname && <p className="form-error">{errors.lastname.message}</p>}

        <label className="form-label" htmlFor="email">Email</label>
        <input id="email" className="form-input" type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} />
        {errors.email && <p className="form-error">{errors.email.message}</p>}

        <label className="form-label" htmlFor="password">Password</label>
        <input id="password" className="form-input" type="password" placeholder="Create a password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })} />
        {errors.password && <p className="form-error">{errors.password.message}</p>}

        <button className="form-cta" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating…' : 'Create account'}</button>

        <p className="form-foot">Already have an account? <a href="/login">Sign in</a></p>
      </form>
    </div>
  )
}

export default Register
