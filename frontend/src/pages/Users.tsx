import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Pencil,
  Power,
  Search,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { PageLoading } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { userService } from '@/services/userService'
import { ROLE_LABELS, ROLE_COLORS } from '@/auth/permissions'
import { cn } from '@/utils/cn'
import type { User } from '@/auth/AuthContext'
import type { Role } from '@/auth/permissions'
import type { UserFormData } from '@/services/userService'

export function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formNome, setFormNome] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formRole, setFormRole] = useState<Role>('USER')
  const [formSetor, setFormSetor] = useState('')

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      const data = await userService.listar()
      setUsers(data)
    } catch {
      toast.error('Erro ao carregar usuarios')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const usersFiltrados = users.filter((u) => {
    if (!busca) return true
    const term = busca.toLowerCase()
    return (
      u.nome.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.setor.toLowerCase().includes(term)
    )
  })

  const abrirModal = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setFormNome(user.nome)
      setFormEmail(user.email)
      setFormRole(user.role)
      setFormSetor(user.setor)
    } else {
      setEditingUser(null)
      setFormNome('')
      setFormEmail('')
      setFormRole('USER')
      setFormSetor('')
    }
    setModalOpen(true)
  }

  const handleSalvar = async () => {
    if (!formNome.trim() || !formEmail.trim() || !formSetor.trim()) {
      toast.error('Preencha todos os campos')
      return
    }

    const data: UserFormData = {
      nome: formNome.trim(),
      email: formEmail.trim(),
      role: formRole,
      setor: formSetor.trim(),
    }

    try {
      setSaving(true)
      if (editingUser) {
        await userService.atualizar(editingUser.id, data)
        toast.success('Usuario atualizado')
      } else {
        await userService.criar(data)
        toast.success('Usuario criado')
      }
      setModalOpen(false)
      carregar()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleStatus = async (user: User) => {
    try {
      await userService.alterarStatus(user.id, !user.ativo)
      toast.success(user.ativo ? 'Usuario inativado' : 'Usuario ativado')
      carregar()
    } catch {
      toast.error('Erro ao alterar status')
    }
  }

  if (loading) return <PageLoading />

  return (
    <div>
      <Header
        title="Gestao de Usuarios"
        subtitle={`${users.length} usuario${users.length !== 1 ? 's' : ''} cadastrado${users.length !== 1 ? 's' : ''}`}
        action={
          <Button onClick={() => abrirModal()}>
            <Plus className="h-4 w-4" />
            Novo Usuario
          </Button>
        }
      />

      <div className="p-8">
        {/* Search */}
        <Card className="mb-6">
          <div className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome, email ou setor..."
                className="block w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </Card>

        {/* Table */}
        {usersFiltrados.length === 0 ? (
          <Card>
            <EmptyState
              title="Nenhum usuario encontrado"
              description="Altere a busca ou crie um novo usuario."
              action={
                <Button onClick={() => abrirModal()}>
                  <Plus className="h-4 w-4" />
                  Novo Usuario
                </Button>
              }
            />
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Nivel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Setor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Acoes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersFiltrados.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                            {user.nome.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {user.nome}
                            </p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            ROLE_COLORS[user.role]
                          )}
                        >
                          {ROLE_LABELS[user.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.setor}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            user.ativo
                              ? 'bg-success-50 text-success-700'
                              : 'bg-slate-100 text-slate-500'
                          )}
                        >
                          {user.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => abrirModal(user)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(user)}
                            className={user.ativo ? 'text-warning-600' : 'text-success-600'}
                          >
                            <Power className="h-3.5 w-3.5" />
                            {user.ativo ? 'Inativar' : 'Ativar'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Modal Criar/Editar */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Editar Usuario' : 'Novo Usuario'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Nome"
            value={formNome}
            onChange={(e) => setFormNome(e.target.value)}
            placeholder="Nome completo"
            required
          />
          <Input
            label="Email"
            type="email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            placeholder="email@empresa.com"
            required
          />
          <Select
            label="Nivel de Acesso"
            value={formRole}
            onChange={(e) => setFormRole(e.target.value as Role)}
            options={[
              { value: 'ADMIN', label: 'Administrador' },
              { value: 'GESTOR', label: 'Gestor' },
              { value: 'USER', label: 'Funcionario' },
            ]}
            required
          />
          <Input
            label="Setor"
            value={formSetor}
            onChange={(e) => setFormSetor(e.target.value)}
            placeholder="Ex: Operacoes, Documentacao, TI"
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar} loading={saving}>
              {editingUser ? 'Salvar' : 'Criar Usuario'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
