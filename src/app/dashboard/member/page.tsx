"use client"
import React, { useState } from 'react'
import Link from 'next/link'

export default function MemberLogin() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  return (
    <main className="min-h-[calc(100vh-7rem)] flex items-center justify-center">
  <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl ring-1 ring-black/5 p-8">
        <div className="mx-auto">
          <h1 className="text-3xl font-bold text-emerald-900">Welcome back!</h1>
          <p className="mt-2 text-[15.5px] leading-8 text-slate-700">Enter your Credentials to access your account</p>

          <form className="mt-8 grid grid-cols-1 gap-4">
            <label className="flex flex-col text-sm">
              <span className="text-slate-700 mb-1">Phone Number</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="555-123-4567"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="text-slate-700 mb-1">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>

            <div className="mt-2">
              <button type="button" className="btn">Login</button>
            </div>

            <div className="mt-4 text-sm text-center text-slate-700">
              Don’t have an account?{' '}
              <Link href="/signup" className="text-emerald-700 hover:underline">Sign Up</Link>{' '}
              or{' '}
              <Link href="/dashboard/check-availability" className="text-emerald-700 hover:underline">View As A Guest</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
