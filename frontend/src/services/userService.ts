import type { User } from '@/auth/AuthContext'
import type { Role } from '@/auth/permissions'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const STORAGE_KEY = 'shiptrack_users'

const defaultUsers: User[] = [
  {
    id: '1',
    nome: 'Admin Sistema',
    email: 'admin@shiptrack.com',
    role: 'ADMIN',
    setor: 'TI',
    ativo: true,
  },
  {
    id: '2',
    nome: 'Carlos Mendes',
    email: 'carlos.mendes@shiptrack.com',
    role: 'GESTOR',
    setor: 'Operacoes',
    ativo: true,
  },
  {
    id: '3',
    nome: 'Ana Paula Silva',
    email: 'ana.silva@shiptrack.com',
    role: 'USER',
    setor: 'Operacoes',
    ativo: true,
  },
  {
    id: '4',
    nome: 'Roberto Santos',
    email: 'roberto.santos@shiptrack.com',
    role: 'USER',
    setor: 'Documentacao',
    ativo: true,
  },
  {
    id: '5',
    nome: 'Maria Oliveira',
    email: 'maria.oliveira@shiptrack.com',
    role: 'GESTOR',
    setor: 'Documentacao',
    ativo: false,
  },
]

function getUsers(): User[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* ignore */ }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
  return [...defaultUsers]
}

function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export interface UserFormData {
  nome: string
  email: string
  role: Role
  setor: string
}

export const userService = {
  async listar(): Promise<User[]> {
    await delay(300)
    return getUsers()
  },

  async buscarPorId(id: string): Promise<User> {
    await delay(200)
    const users = getUsers()
    const user = users.find((u) => u.id === id)
    if (!user) throw new Error('Usuario nao encontrado')
    return { ...user }
  },

  async criar(data: UserFormData): Promise<User> {
    await delay(400)
    const users = getUsers()

    const emailExiste = users.some((u) => u.email === data.email)
    if (emailExiste) throw new Error('Email ja cadastrado')

    const novoUser: User = {
      id: String(Date.now()),
      ...data,
      ativo: true,
    }

    users.push(novoUser)
    saveUsers(users)
    return { ...novoUser }
  },

  async atualizar(id: string, data: Partial<UserFormData>): Promise<User> {
    await delay(300)
    const users = getUsers()
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) throw new Error('Usuario nao encontrado')

    if (data.email && data.email !== users[index].email) {
      const emailExiste = users.some((u) => u.email === data.email && u.id !== id)
      if (emailExiste) throw new Error('Email ja cadastrado')
    }

    users[index] = { ...users[index], ...data }
    saveUsers(users)
    return { ...users[index] }
  },

  async alterarStatus(id: string, ativo: boolean): Promise<User> {
    await delay(300)
    const users = getUsers()
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) throw new Error('Usuario nao encontrado')

    users[index].ativo = ativo
    saveUsers(users)
    return { ...users[index] }
  },

  async deletar(id: string): Promise<void> {
    await delay(300)
    const users = getUsers()
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) throw new Error('Usuario nao encontrado')
    users.splice(index, 1)
    saveUsers(users)
  },
}
