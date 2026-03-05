import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/auth/AuthContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { ResourceRoute } from '@/routes/ResourceRoute'
import { RoleRoute } from '@/routes/RoleRoute'
import { Dashboard } from '@/pages/Dashboard'
import { ProcessoForm } from '@/pages/ProcessoForm'
import { ProcessoList } from '@/pages/ProcessoList'
import { ProcessoDetalhes } from '@/pages/ProcessoDetalhes'
import { Conferencia } from '@/pages/Conferencia'
import { CEMercante } from '@/pages/CEMercante'
import { Users } from '@/pages/Users'
import { Unauthorized } from '@/pages/Unauthorized'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
            {/* Dashboard - todos os roles */}
            <Route
              path="/"
              element={
                <ResourceRoute resource="dashboard">
                  <Dashboard />
                </ResourceRoute>
              }
            />

            {/* Processos */}
            <Route
              path="/processos"
              element={
                <ResourceRoute resource="processos">
                  <ProcessoList />
                </ResourceRoute>
              }
            />
            <Route
              path="/processos/novo"
              element={
                <ResourceRoute resource="processos">
                  <ProcessoForm />
                </ResourceRoute>
              }
            />
            <Route
              path="/processos/:id"
              element={
                <ResourceRoute resource="processos">
                  <ProcessoDetalhes />
                </ResourceRoute>
              }
            />

            {/* Conferencia */}
            <Route
              path="/conferencia"
              element={
                <ResourceRoute resource="conferencia">
                  <Conferencia />
                </ResourceRoute>
              }
            />

            {/* CE Mercante */}
            <Route
              path="/ce-mercante"
              element={
                <ResourceRoute resource="ce-mercante">
                  <CEMercante />
                </ResourceRoute>
              }
            />

            {/* Usuarios - apenas ADMIN */}
            <Route
              path="/usuarios"
              element={
                <RoleRoute roles={['ADMIN']}>
                  <Users />
                </RoleRoute>
              }
            />

            {/* Paginas futuras com placeholder */}
            <Route
              path="/relatorios"
              element={
                <RoleRoute roles={['ADMIN', 'GESTOR']}>
                  <PlaceholderPage title="Relatorios" />
                </RoleRoute>
              }
            />
            <Route
              path="/configuracoes"
              element={
                <RoleRoute roles={['ADMIN']}>
                  <PlaceholderPage title="Configuracoes" />
                </RoleRoute>
              }
            />

            {/* Acesso negado */}
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          Esta pagina sera implementada em breve.
        </p>
      </div>
    </div>
  )
}
