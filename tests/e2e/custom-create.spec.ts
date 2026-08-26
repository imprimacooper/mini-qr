import { test, expect } from '@playwright/test'

test.describe('Custom QR creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows the required fields for each content type', async ({ page }) => {
    await expect(page.locator('#content-type')).toBeVisible()
    await expect(page.locator('label', { hasText: 'Tipo de QR-Code' })).toBeVisible()
    await expect(page.locator('#visual-preset')).toHaveCount(0)
    await expect(page.locator('#content')).toBeVisible()

    await page.locator('#content-type').selectOption('pix')
    await expect(page.locator('#pix-key-type')).toBeVisible()
    await expect(page.locator('#pix-key')).toBeVisible()
    await expect(page.locator('#content')).not.toBeVisible()

    await page.locator('#content-type').selectOption('wifi')
    await expect(page.locator('#wifi-ssid')).toBeVisible()
    await expect(page.locator('#wifi-password')).toBeVisible()

    await page.locator('#content-type').selectOption('instagram')
    await expect(page.locator('#instagram-username')).toBeVisible()

    await page.locator('#content-type').selectOption('whatsapp')
    await expect(page.locator('#whatsapp-number')).toBeVisible()
    await expect(page.locator('#whatsapp-message')).toBeVisible()
  })

  test('generates and exports an Instagram QR code', async ({ page }) => {
    await page.locator('#content-type').selectOption('instagram')
    await page.locator('#instagram-username').fill('@empresa')
    await page.getByRole('button', { name: 'Gerar QR Code' }).click()

    await expect(page.locator('[aria-label="QR Code gerado"]')).toBeVisible()

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Baixar SVG' }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toBe('qr-code.svg')
  })
})
