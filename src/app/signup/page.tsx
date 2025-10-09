"use client"
import React, { useState } from 'react'
import Link from 'next/link'

export default function MemberSignUp() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <main className="min-h-[calc(100vh-7rem)] flex items-center justify-center">
  <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl ring-1 ring-black/5 p-8">
        <div className="mx-auto">
          <h1 className="text-3xl font-bold text-emerald-900">Create Member Account</h1>
          <p className="mt-2 text-[15.5px] leading-8 text-slate-700">Enter your details to create a member account</p>

          <form className="mt-8 grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col text-sm">
                <span className="text-slate-700 mb-1">First Name</span>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </label>

              <label className="flex flex-col text-sm">
                <span className="text-slate-700 mb-1">Last Name</span>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </label>
            </div>

            <label className="flex flex-col text-sm">
              <span className="text-slate-700 mb-1">Phone Number</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="555-123-4567" className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </label>

            <label className="flex flex-col text-sm">
              <span className="text-slate-700 mb-1">Email address</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="janedoe@example.com" className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </label>

            <div className="flex items-center justify-between gap-4">
              <label className="flex-1 flex flex-col text-sm">
                <span className="text-slate-700 mb-1">Password</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </label>
            </div>

            <div className="mt-2">
              <button type="button" className="btn">Sign Up</button>
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
