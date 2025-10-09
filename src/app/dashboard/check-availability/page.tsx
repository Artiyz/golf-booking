import Link from 'next/link'

export default function GuestCheckAvailabilityPage() {
  return (
    <main className="min-h-[calc(100vh-7rem)] flex items-center justify-center p-6">
  <div className="w-full max-w-md bg-white rounded-3xl shadow-xl ring-1 ring-black/5 p-8">
        <div className="mx-auto">
          <h1 className="text-3xl font-bold text-emerald-900">Check Availability</h1>
          <p className="mt-2 text-[15.5px] leading-8 text-slate-700">Placeholder: Use this page to quickly check bay availability for booking. If you would like to book a tee time, please <Link href="/dashboard/member" className="text-emerald-700 hover:underline">log in</Link> or <Link href="/signup" className="text-emerald-700 hover:underline">sign up</Link> as a member.</p>
        </div>
      </div>
    </main>
  )
}
