import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "react-toastify/dist/ReactToastify.css"
import { ProductProvider } from './Context/ProductContext.jsx'
import { LanguageProvider } from './Context/LanguageContext.jsx'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <ProductProvider>
        <App />
        {/* Toast Container MO */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </ProductProvider>
    </LanguageProvider>
  </StrictMode>
)
