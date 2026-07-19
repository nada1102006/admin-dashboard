import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "react-toastify/dist/ReactToastify.css"
import { ProductProvider } from './Context/ProductContext.jsx'
import { LanguageProvider } from './Context/LanguageContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ProductProvider>
        <App />
      </ProductProvider>
    </LanguageProvider>
  </StrictMode>
)
