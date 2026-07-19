import { Link } from 'react-router-dom'
import { useLanguage } from '../../Context/LanguageContext'

export default function ProductNotFound() {
  const { t } = useLanguage();
  return (
    <>
     <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 dark:bg-slate-950">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
          {t("productDetails.notFound")}
        </h2>

        <Link
          to="/products"
          className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800"
        >
          {t("productDetails.backToProducts")}
        </Link>
      </div>
    </>
  )
}
