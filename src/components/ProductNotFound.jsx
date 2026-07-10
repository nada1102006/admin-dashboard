import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductNotFound() {
  return (
    <>
     <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
        <h2 className="text-3xl font-bold text-slate-800">
          Product Not Found
        </h2>

        <Link
          to="/products"
          className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800"
        >
          Back to Products
        </Link>
      </div>
    </>
  )
}