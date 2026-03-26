export function getInitials(nome: string) {
  const names = nome.trim().split(" ")
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
  }
  return nome.substring(0, 2).toUpperCase()
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function maskToken(token: string) {
  if (!token || token.length < 12) return token
  return `${token.substring(0, 8)}...${token.substring(token.length - 4)}`
}
