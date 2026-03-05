import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { ProcessoForm } from '@/pages/ProcessoForm'
import { ProcessoList } from '@/pages/ProcessoList'
import { ProcessoDetalhes } from '@/pages/ProcessoDetalhes'
import { Conferencia } from '@/pages/Conferencia'
import { CEMercante } from '@/pages/CEMercante'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#f0fdf4',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fef2f2',
            },
          },
        }}
      />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/processos" element={<ProcessoList />} />
          <Route path="/processos/novo" element={<ProcessoForm />} />
          <Route path="/processos/:id" element={<ProcessoDetalhes />} />
          <Route path="/conferencia" element={<Conferencia />} />
          <Route path="/ce-mercante" element={<CEMercante />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
