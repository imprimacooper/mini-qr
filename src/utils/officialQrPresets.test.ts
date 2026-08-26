import { describe, expect, it, vi } from 'vitest'
import {
  OFFICIAL_PRESET_FILES,
  isOfficialQrPreset,
  loadOfficialQrPresets
} from './officialQrPresets'

const validJson = {
  props: { data: 'example', width: 2500, height: 2500 },
  style: { borderRadius: '15px', background: '#ffffff' }
}

describe('official QR presets', () => {
  it('validates the public preset structure', () => {
    expect(isOfficialQrPreset(validJson)).toBe(true)
    expect(isOfficialQrPreset({ props: {}, style: { borderRadius: '15px' } })).toBe(false)
  })

  it('loads and maps official preset files', async () => {
    const fetcher = vi.fn(async (url: string) => ({
      ok: true,
      json: async () => validJson,
      url
    })) as unknown as typeof fetch
    const presets = await loadOfficialQrPresets(fetcher)

    expect(presets).toHaveLength(OFFICIAL_PRESET_FILES.length)
    expect(presets.map((preset) => preset.filename)).toEqual([...OFFICIAL_PRESET_FILES])
    expect(presets.find((preset) => preset.filename.endsWith('pix.json'))?.name).toBe('PIX')
    expect(fetcher).toHaveBeenCalledWith(expect.stringContaining('/presets/'))
  })

  it('skips a preset that cannot be loaded', async () => {
    const fetcher = vi.fn(async (url: string) => {
      if (url.includes('pix')) return { ok: false, json: async () => ({}) }
      return { ok: true, json: async () => validJson }
    }) as unknown as typeof fetch

    const presets = await loadOfficialQrPresets(fetcher)
    expect(presets).toHaveLength(OFFICIAL_PRESET_FILES.length - 1)
    expect(presets.some((preset) => preset.filename.includes('pix'))).toBe(false)
  })
})
