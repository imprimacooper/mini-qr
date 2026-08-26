import { describe, expect, it } from 'vitest'
import {
  calculatePixCRC16,
  generateInstagramUrl,
  generateLink,
  generatePixPayload,
  generateWhatsappUrl,
  generateWifiPayload,
  normalizePixKey,
  normalizeWhatsappNumber
} from './qrContentGenerators'

function crcFromPayload(payload: string): string {
  return payload.slice(-4)
}

describe('QR content generators', () => {
  it.each([
    ['cpf', '529.982.247-25', '52998224725'],
    ['cnpj', '04.252.011/0001-10', '04252011000110'],
    ['email', ' pessoa@example.com ', 'pessoa@example.com'],
    ['phone', '(11) 99999-9999', '+11999999999'],
    ['evp', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000']
  ])('normalizes PIX %s', (type, value, expected) => {
    expect(normalizePixKey(type as Parameters<typeof normalizePixKey>[0], value)).toBe(expected)
  })

  it.each([
    ['cpf', '529.982.247-25'],
    ['cnpj', '04.252.011/0001-10'],
    ['email', 'pessoa@example.com'],
    ['phone', '+55 (11) 99999-9999'],
    ['evp', '123e4567-e89b-12d3-a456-426614174000']
  ])('generates a valid PIX payload for %s', (type, value) => {
    const payload = generatePixPayload(type as Parameters<typeof generatePixPayload>[0], value)
    expect(payload).toMatch(/^00020126/)
    expect(crcFromPayload(payload)).toBe(calculatePixCRC16(payload.slice(0, -4)))
  })

  it('rejects invalid PIX keys', () => {
    expect(() => generatePixPayload('cpf', '123.456.789-00')).toThrow('chave PIX válida')
    expect(() => generatePixPayload('email', 'invalid')).toThrow('chave PIX válida')
  })

  it('generates escaped Wi-Fi payloads', () => {
    expect(generateWifiPayload('Rede; 2G', 'senha "especial"')).toBe(
      'WIFI:T:WPA;S:Rede\\; 2G;P:senha \\"especial\\";;'
    )
  })

  it('generates Instagram URLs from both username forms', () => {
    expect(generateInstagramUrl('@ meu usuario ')).toBe('https://instagram.com/meuusuario')
    expect(generateInstagramUrl('meuusuario')).toBe('https://instagram.com/meuusuario')
  })

  it('normalizes WhatsApp numbers and encodes messages', () => {
    expect(normalizeWhatsappNumber('+55 (11) 99999-9999')).toBe('5511999999999')
    expect(generateWhatsappUrl('+55 (11) 99999-9999', 'Olá, mundo!')).toBe(
      'https://wa.me/5511999999999?text=Ol%C3%A1%2C%20mundo!'
    )
  })

  it('validates links without changing their contents', () => {
    expect(generateLink(' https://example.com/a?b=1 ')).toBe('https://example.com/a?b=1')
    expect(() => generateLink('example.com')).toThrow('link válido')
  })
})
