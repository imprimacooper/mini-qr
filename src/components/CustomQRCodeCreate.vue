<script setup lang="ts">
import StyledQRCode from '@/components/StyledQRCode.vue'
import {
  downloadJpgElement,
  downloadPngElement,
  downloadSvgElement,
  type ImageExportInput
} from '@/utils/convertToImage'
import {
  generateInstagramUrl,
  generateLink,
  generatePixPayload,
  generateWhatsappUrl,
  generateWifiPayload,
  type PixKeyType
} from '@/utils/qrContentGenerators'
import { loadOfficialQrPresets, type OfficialQrPreset } from '@/utils/officialQrPresets'
import type { Options } from '@/lib/qr-code'
import { computed, onMounted, ref, watch } from 'vue'

type ContentType = 'link' | 'pix' | 'wifi' | 'instagram' | 'whatsapp'

interface QrTypeOption {
  value: string
  label: string
  type: ContentType
  preset: string
}

const qrTypeOptions: QrTypeOption[] = [
  { value: 'youtube', label: 'YouTube', type: 'link', preset: 'qr-code-config-youtube.json' },
  { value: 'spotify', label: 'Spotify', type: 'link', preset: 'qr-code-config-spotify.json' },
  {
    value: 'standard-pb',
    label: 'Padrão Preto e Branco',
    type: 'link',
    preset: 'qr-code-config-padrão.json'
  },
  {
    value: 'whatsapp',
    label: 'WhatsApp',
    type: 'whatsapp',
    preset: 'qr-code-config-whatsapp.json'
  },
  { value: 'wifi', label: 'Wi-Fi', type: 'wifi', preset: 'qr-code-config-wifi.json' },
  {
    value: 'instagram',
    label: 'Instagram',
    type: 'instagram',
    preset: 'qr-code-config-instagram.json'
  },
  {
    value: 'instagram-pb',
    label: 'Instagram Preto e Branco',
    type: 'instagram',
    preset: 'qr-code-config-instagram-pb.json'
  },
  { value: 'pix', label: 'Pix', type: 'pix', preset: 'qr-code-config-pix.json' }
]

const pixKeyTypes: { value: PixKeyType; label: string }[] = [
  { value: 'cpf', label: 'CPF' },
  { value: 'cnpj', label: 'CNPJ' },
  { value: 'email', label: 'E-mail' },
  { value: 'phone', label: 'Telefone' },
  { value: 'evp', label: 'Chave aleatória (EVP)' }
]

const selectedTypeValue = ref('standard-pb')
const pixKeyType = ref<PixKeyType>('cpf')
const genericValue = ref('')
const wifiSsid = ref('')
const wifiPassword = ref('')
const instagramUsername = ref('')
const whatsappNumber = ref('')
const whatsappMessage = ref('')
const presets = ref<OfficialQrPreset[]>([])
const generatedData = ref('')
const errorMessage = ref('')
const presetLoadError = ref('')
const logoVisible = ref(true)
const logoSrc = `${import.meta.env.BASE_URL}logo.svg`

const selectedType = computed(
  () => qrTypeOptions.find((option) => option.value === selectedTypeValue.value) ?? qrTypeOptions[2]
)
const contentType = computed(() => selectedType.value.type)

const selectedPreset = computed(() =>
  presets.value.find((preset) => preset.filename === selectedType.value.preset)
)
const renderProps = computed<Options | null>(() => {
  if (!selectedPreset.value || !generatedData.value) return null
  return { ...selectedPreset.value.props, data: generatedData.value }
})
const exportInput = computed<ImageExportInput | null>(() => {
  const preset = selectedPreset.value
  const options = renderProps.value
  if (!preset || !options) return null
  return {
    options,
    outerBackground: preset.style.background,
    borderRadius: preset.style.borderRadius,
    size: {
      width: options.width ?? 200,
      height: options.height ?? 200
    }
  }
})

watch(selectedTypeValue, () => {
  errorMessage.value = ''
})

onMounted(async () => {
  try {
    presets.value = await loadOfficialQrPresets()
    if (presets.value.length === 0) {
      presetLoadError.value = 'Não foi possível carregar os presets visuais.'
    }
  } catch {
    presetLoadError.value = 'Não foi possível carregar os presets visuais.'
  }
})

function buildContent(): string {
  switch (contentType.value) {
    case 'pix':
      return generatePixPayload(pixKeyType.value, genericValue.value)
    case 'wifi':
      return generateWifiPayload(wifiSsid.value, wifiPassword.value)
    case 'instagram':
      return generateInstagramUrl(instagramUsername.value)
    case 'whatsapp':
      return generateWhatsappUrl(whatsappNumber.value, whatsappMessage.value)
    case 'link':
      return generateLink(genericValue.value)
  }
}

function generateQRCode(): void {
  errorMessage.value = ''
  try {
    generatedData.value = buildContent()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Verifique os dados informados.'
  }
}

function download(format: 'png' | 'jpg' | 'svg'): void {
  if (!exportInput.value) return
  if (format === 'png') downloadPngElement(exportInput.value, 'qr-code.png')
  if (format === 'jpg') downloadJpgElement(exportInput.value, 'qr-code.jpg')
  if (format === 'svg') downloadSvgElement(exportInput.value, 'qr-code.svg')
}
</script>

<template>
  <main class="custom-generator">
    <header class="generator-header">
      <img
        v-if="logoVisible"
        :src="logoSrc"
        alt=""
        class="company-logo"
        @error="logoVisible = false"
      />
    </header>

    <form class="generator-form" @submit.prevent="generateQRCode">
      <div class="field-group">
        <label for="content-type">Tipo de QR-Code</label>
        <select id="content-type" v-model="selectedTypeValue" class="custom-input">
          <option v-for="option in qrTypeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <template v-if="contentType === 'pix'">
        <div class="field-group">
          <label for="pix-key-type">Tipo de chave</label>
          <select id="pix-key-type" v-model="pixKeyType" class="custom-input">
            <option v-for="option in pixKeyTypes" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="field-group">
          <label for="pix-key">Chave PIX</label>
          <input id="pix-key" v-model="genericValue" class="custom-input" type="text" />
        </div>
      </template>

      <template v-else-if="contentType === 'wifi'">
        <div class="field-group">
          <label for="wifi-ssid">SSID</label>
          <input id="wifi-ssid" v-model="wifiSsid" class="custom-input" type="text" />
        </div>
        <div class="field-group">
          <label for="wifi-password">Senha</label>
          <input id="wifi-password" v-model="wifiPassword" class="custom-input" type="text" />
        </div>
      </template>

      <div v-else-if="contentType === 'instagram'" class="field-group">
        <label for="instagram-username">@ do Instagram</label>
        <input
          id="instagram-username"
          v-model="instagramUsername"
          class="custom-input"
          type="text"
        />
      </div>

      <template v-else-if="contentType === 'whatsapp'">
        <div class="field-group">
          <label for="whatsapp-number">Número</label>
          <input id="whatsapp-number" v-model="whatsappNumber" class="custom-input" type="tel" />
        </div>
        <div class="field-group">
          <label for="whatsapp-message">Mensagem</label>
          <textarea id="whatsapp-message" v-model="whatsappMessage" class="custom-input" rows="3" />
        </div>
      </template>

      <div v-else class="field-group">
        <label :for="contentType === 'link' ? 'link' : 'content'">
          {{ contentType === 'link' ? 'Link' : 'Conteúdo' }}
        </label>
        <textarea
          :id="contentType === 'link' ? 'link' : 'content'"
          v-model="genericValue"
          class="custom-input"
          rows="3"
        />
      </div>

      <p v-if="presetLoadError" class="error-message">{{ presetLoadError }}</p>
      <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
      <button class="generate-button" type="submit" :disabled="!selectedPreset">
        Gerar QR Code
      </button>
    </form>

    <section v-if="renderProps && selectedPreset" class="result-section" aria-live="polite">
      <div
        class="qr-preview"
        :style="{
          background: selectedPreset.style.background,
          borderRadius: selectedPreset.style.borderRadius
        }"
      >
        <StyledQRCode v-bind="renderProps" role="img" aria-label="QR Code gerado" />
      </div>
      <div class="export-actions">
        <button type="button" @click="download('png')">Baixar PNG</button>
        <button type="button" @click="download('jpg')">Baixar JPG</button>
        <button type="button" @click="download('svg')">Baixar SVG</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.custom-generator {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(260px, 360px) minmax(240px, 1fr);
  gap: 2.5rem;
  max-width: 920px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  color: #27272a;
}

.generator-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  min-height: 72px;
}

.company-logo {
  display: block;
  max-width: min(240px, 80vw);
  max-height: 72px;
  object-fit: contain;
}

.generator-form,
.result-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: left;
}

.field-group label {
  color: #3f3f46;
  font-size: 0.95rem;
  font-weight: 600;
}

.custom-input {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #d4d4d8;
  border-radius: 6px;
  background: #fff;
  padding: 0.75rem;
  color: #18181b;
  font: inherit;
}

.custom-input:focus-visible,
button:focus-visible {
  outline: 2px solid #27272a;
  outline-offset: 2px;
}

.generate-button,
.export-actions button {
  border: 0;
  border-radius: 6px;
  background: #27272a;
  padding: 0.75rem 1rem;
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
}

.generate-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.result-section {
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.qr-preview {
  display: grid;
  width: min(100%, 360px);
  aspect-ratio: 1;
  place-items: center;
  overflow: hidden;
}

.qr-preview :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.export-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.export-actions button {
  background: #52525b;
  font-size: 0.9rem;
}

.error-message {
  margin: 0;
  color: #b91c1c;
  font-size: 0.9rem;
  text-align: left;
}

@media (max-width: 700px) {
  .custom-generator {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-top: 1.5rem;
  }

  .result-section {
    min-height: 0;
  }
}
</style>
