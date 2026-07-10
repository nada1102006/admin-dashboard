import { IoArrowBack } from 'react-icons/io5'
import { Link } from 'react-router-dom'

export default function HeaderPadge({ productName }) {
    return (
        <>
            <div className="mb-8 rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-lg ">

                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white mb-4"
                >
                    <IoArrowBack size={18} />
                    Back to Products
                </Link>

                <h1 className="mt-6 text-4xl font-bold">
                    {productName}
                </h1>

                <p className="mt-2 text-slate-400">
                    Product details overview
                </p>

            </div>
        </>
    )
}