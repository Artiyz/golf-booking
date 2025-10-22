"use client"
import React, { useState } from 'react'
import Link from 'next/link'

type Errors = {
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
  password?: string
}

const nameRe = /^[A-Za-z][A-Za-z' -]{1,39}$/
const phoneRe = /^[0-9+()\-.\s]{7,20}$/
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function MemberSignUp() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  function validateField(name: keyof Errors, value: string): string | undefined {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'Please enter your first name'
        if (!nameRe.test(value.trim())) return 'Use letters only (2–40 chars)'
        return undefined
      case 'lastName':
        if (!value.trim()) return 'Please enter your last name'
        if (!nameRe.test(value.trim())) return 'Use letters only (2–40 chars)'
        return undefined
      case 'phone':
        if (!value.trim()) return 'Please enter your phone number'
        if (!phoneRe.test(value.trim())) return 'Enter a valid phone (digits, +, (), - allowed)'
        return undefined
      case 'email':
        if (!value.trim()) return 'Please enter your email'
        if (!emailRe.test(value.trim())) return 'Enter a valid email address'
        return undefined
      case 'password':
        if (!value) return 'Please create a password'
        if (value.length < 6) return 'Password must be at least 6 characters'
        return undefined
      default:
        return undefined
    }
  }

  function onBlur(name: keyof Errors, value: string) {
    const msg = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: msg }))
  }

  function onChange(name: keyof Errors, value: string, setter: (v: string)=>void) {
    setter(value)
    if (errors[name]) {
      const msg = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: msg }))
    }
  }

  async function onSignup(){
    const fields: [keyof Errors, string][] = [
      ['firstName', firstName],
      ['lastName', lastName],
      ['phone', phone],
      ['email', email],
      ['password', password],
    ]
    const next: Errors = {}
    for (const [k, v] of fields) next[k] = validateField(k, v)
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    try{
      const payload={ firstName,lastName,email,phone,password }
      const r=await fetch("/api/auth/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)})
      const j=await r.json().catch(()=>({}))
      if(!r.ok){ alert(j.error||"Could not sign up"); return }
      location.href="/dashboard/member"
    }catch{ alert("Could not sign up") }
  }

  return (
    <main className="min-h-[calc(100vh-7rem)] flex items-start justify-center pt-10 sm:pt-16">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl ring-1 ring-black/5 p-8">
        <div className="mx-auto">
          <h1 className="text-3xl font-bold text-emerald-900">Create Member Account</h1>
          <p className="mt-2 text-[15.5px] leading-8 text-slate-700">Enter your details to create a member account</p>

          <form className="mt-8 grid grid-cols-1 gap-4" onSubmit={(e)=>{e.preventDefault();onSignup();}}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col text-sm">
                <span className="text-slate-700 mb-1">First Name</span>
                <input
                  value={firstName}
                  onChange={(e)=>onChange('firstName', e.target.value, setFirstName)}
                  onBlur={(e)=>onBlur('firstName', e.target.value)}
                  placeholder="Jane"
                  aria-invalid={!!errors.firstName}
                  aria-describedby="err-firstName"
                  className={`w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 ${errors.firstName ? 'focus:ring-red-500 ring-1 ring-red-500' : 'focus:ring-emerald-500'}`}
                />
                {errors.firstName && <p id="err-firstName" className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
              </label>

              <label className="flex flex-col text-sm">
                <span className="text-slate-700 mb-1">Last Name</span>
                <input
                  value={lastName}
                  onChange={(e)=>onChange('lastName', e.target.value, setLastName)}
                  onBlur={(e)=>onBlur('lastName', e.target.value)}
                  placeholder="Doe"
                  aria-invalid={!!errors.lastName}
                  aria-describedby="err-lastName"
                  className={`w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 ${errors.lastName ? 'focus:ring-red-500 ring-1 ring-red-500' : 'focus:ring-emerald-500'}`}
                />
                {errors.lastName && <p id="err-lastName" className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
              </label>
            </div>

            <label className="flex flex-col text-sm">
              <span className="text-slate-700 mb-1">Phone Number</span>
              <input
                value={phone}
                onChange={(e)=>onChange('phone', e.target.value, setPhone)}
                onBlur={(e)=>onBlur('phone', e.target.value)}
                placeholder="555-123-4567"
                aria-invalid={!!errors.phone}
                aria-describedby="err-phone"
                className={`w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 ${errors.phone ? 'focus:ring-red-500 ring-1 ring-red-500' : 'focus:ring-emerald-500'}`}
              />
              {errors.phone && <p id="err-phone" className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </label>

            <label className="flex flex-col text-sm">
              <span className="text-slate-700 mb-1">Email address</span>
              <input
                value={email}
                onChange={(e)=>onChange('email', e.target.value, setEmail)}
                onBlur={(e)=>onBlur('email', e.target.value)}
                placeholder="janedoe@example.com"
                aria-invalid={!!errors.email}
                aria-describedby="err-email"
                className={`w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500 ring-1 ring-red-500' : 'focus:ring-emerald-500'}`}
              />
              {errors.email && <p id="err-email" className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </label>

            <div className="flex items-center justify-between gap-4">
              <label className="flex-1 flex flex-col text-sm">
                <span className="text-slate-700 mb-1">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e)=>onChange('password', e.target.value, setPassword)}
                  onBlur={(e)=>onBlur('password', e.target.value)}
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  aria-describedby="err-password"
                  className={`w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 ${errors.password ? 'focus:ring-red-500 ring-1 ring-red-500' : 'focus:ring-emerald-500'}`}
                />
                {errors.password && <p id="err-password" className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </label>
            </div>

            <div className="mt-2">
              <button type="submit" className="btn">Sign Up</button>
            </div>

            <div className="mt-4 text-sm text-center text-slate-700">
              Already have an account? <Link href="/dashboard/member" className="text-emerald-700 hover:underline">Log In</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
