import { IoArrowBack } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../Context/LanguageContext'

export default function HeaderPadge({ productName }) {
    const { t } = useLanguage();
    return (
        <>
            <div className="mb-8 rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-lg dark:border dark:border-slate-800 dark:bg-slate-900">

                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white mb-4"
                >
                    <IoArrowBack size={18} />
                    {t("productDetails.backToProducts")}
                </Link>

                <h1 className="mt-6 text-4xl font-bold">
                    {productName}
                </h1>

                <p className="mt-2 text-slate-400">
                    {t("productDetails.detailsOverview")}
                </p>

            </div>
        </>
    )
}
