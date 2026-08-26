import type { Options } from '@/lib/qr-code'

export const OFFICIAL_PRESET_FILES = [
  'qr-code-config-instagram.json',
  'qr-code-config-instagram-pb.json',
  'qr-code-config-padrão.json',
  'qr-code-config-pix.json',
  'qr-code-config-spotify.json',
  'qr-code-config-whatsapp.json',
  'qr-code-config-wifi.json',
  'qr-code-config-youtube.json'
] as const

export interface OfficialQrPreset {
  filename: string
  name: string
  props: Options
  style: {
    borderRadius: string
    background: string
  }
}

const PRESET_NAMES: Record<string, string> = {
  'qr-code-config-instagram.json': 'Instagram',
  'qr-code-config-instagram-pb.json': 'Instagram Preto e Branco',
  'qr-code-config-padrão.json': 'Padrão Preto e Branco',
  'qr-code-config-pix.json': 'PIX',
  'qr-code-config-spotify.json': 'Spotify',
  'qr-code-config-whatsapp.json': 'WhatsApp',
  'qr-code-config-wifi.json': 'Wi-Fi',
  'qr-code-config-youtube.json': 'YouTube'
}

export function isOfficialQrPreset(
  value: unknown
): value is Omit<OfficialQrPreset, 'filename' | 'name'> {
  if (!value || typeof value !== 'object') return false
  const preset = value as Record<string, unknown>
  const style = preset.style as Record<string, unknown> | undefined
  return Boolean(
    preset.props &&
    typeof preset.props === 'object' &&
    style &&
    typeof style.borderRadius === 'string' &&
    typeof style.background === 'string'
  )
}

export async function loadOfficialQrPresets(
  fetcher: typeof fetch = fetch
): Promise<OfficialQrPreset[]> {
  const results = await Promise.allSettled(
    OFFICIAL_PRESET_FILES.map(async (filename) => {
      const url = `${import.meta.env.BASE_URL}presets/${encodeURIComponent(filename)}`
      const response = await fetcher(url)
      if (!response.ok) throw new Error(`Não foi possível carregar ${filename}.`)
      const json: unknown = await response.json()
      if (!isOfficialQrPreset(json)) throw new Error(`Preset inválido: ${filename}.`)
      return {
        filename,
        name: PRESET_NAMES[filename],
        props: json.props,
        style: json.style
      }
    })
  )

  return results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []))
}
