import { escapeWiFi } from './dataEncoding'

export type PixKeyType = 'cpf' | 'cnpj' | 'email' | 'phone' | 'evp'

const PIX_MERCHANT_CATEGORY = '52040000'
const PIX_CURRENCY = '5303986'
const PIX_COUNTRY = '5802BR'
const PIX_ADDITIONAL_DATA = '62070503***'

function byteLength(value: string): number {
  return new TextEncoder().encode(value).length
}

function tlv(id: string, value: string): string {
  const length = String(byteLength(value)).padStart(2, '0')
  if (length.length > 2) throw new Error('Valor BR Code excede o tamanho permitido.')
  return `${id}${length}${value}`
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

function isValidCpf(value: string): boolean {
  if (!/^\d{11}$/.test(value) || /^([0-9])\1+$/.test(value)) return false
  let sum = 0
  for (let index = 0; index < 9; index++) sum += Number(value[index]) * (10 - index)
  let digit = (sum * 10) % 11
  if (digit === 10) digit = 0
  if (digit !== Number(value[9])) return false
  sum = 0
  for (let index = 0; index < 10; index++) sum += Number(value[index]) * (11 - index)
  digit = (sum * 10) % 11
  if (digit === 10) digit = 0
  return digit === Number(value[10])
}

function isValidCnpj(value: string): boolean {
  if (!/^\d{14}$/.test(value) || /^([0-9])\1+$/.test(value)) return false
  const calculateDigit = (length: number): number => {
    const weights =
      length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const sum = value
      .slice(0, length)
      .split('')
      .reduce((total, digit, index) => total + Number(digit) * weights[index], 0)
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }
  return calculateDigit(12) === Number(value[12]) && calculateDigit(13) === Number(value[13])
}

export function normalizePixKey(type: PixKeyType, value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (type === 'cpf' || type === 'cnpj') return onlyDigits(trimmed)
  if (type === 'phone') {
    const digits = onlyDigits(trimmed)
    return digits ? `+${digits}` : ''
  }
  return trimmed
}

export function validatePixKey(type: PixKeyType, value: string): boolean {
  const normalized = normalizePixKey(type, value)
  switch (type) {
    case 'cpf':
      return isValidCpf(normalized)
    case 'cnpj':
      return isValidCnpj(normalized)
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
    case 'phone':
      return /^\+\d{10,15}$/.test(normalized)
    case 'evp':
      return /^[a-zA-Z0-9-]{20,64}$/.test(normalized)
  }
}

export function calculatePixCRC16(value: string): string {
  let crc = 0xffff
  for (const byte of new TextEncoder().encode(value)) {
    crc ^= byte << 8
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc & 0x8000) !== 0 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export function generatePixPayload(type: PixKeyType, value: string): string {
  const key = normalizePixKey(type, value)
  if (!validatePixKey(type, key)) throw new Error('Informe uma chave PIX válida.')
  const merchantAccount = `${tlv('00', 'BR.GOV.BCB.PIX')}${tlv('01', key)}`
  const withoutCrc = `000201${tlv('26', merchantAccount)}${PIX_MERCHANT_CATEGORY}${PIX_CURRENCY}${PIX_COUNTRY}${PIX_ADDITIONAL_DATA}6304`
  return `${withoutCrc}${calculatePixCRC16(withoutCrc)}`
}

export function generateWifiPayload(ssid: string, password: string): string {
  if (!ssid.trim()) throw new Error('Informe o SSID.')
  if (!password) throw new Error('Informe a senha.')
  return `WIFI:T:WPA;S:${escapeWiFi(ssid)};P:${escapeWiFi(password)};;`
}

export function generateInstagramUrl(username: string): string {
  const normalized = username.trim().replace(/^@/, '').replace(/\s/g, '')
  if (!normalized) throw new Error('Informe um usuário do Instagram.')
  return `https://instagram.com/${normalized}`
}

export function normalizeWhatsappNumber(value: string): string {
  return onlyDigits(value)
}

export function generateWhatsappUrl(number: string, message: string): string {
  const normalized = normalizeWhatsappNumber(number)
  if (!normalized) throw new Error('Informe um número de WhatsApp.')
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}

export function generateLink(value: string): string {
  const link = value.trim()
  if (!link || !/^https?:\/\/[^\s]+$/i.test(link)) throw new Error('Informe um link válido.')
  return link
}
