import { test, expect } from '@playwright/test';
import { needsNeutralGreenEdge } from '../src/lib/ink';

test('green edge applies to approved teal and green families only', () => {
  for (const color of ['#80cbc4', '#33b679', '#0b8043', '#00ff00', '#8c8']) {
    expect(needsNeutralGreenEdge(color), color).toBe(true);
  }
  for (const color of ['#b39ddb', '#7986cb', '#ff0000', '#ffff00', '#0000ff', '#888888', '#000', '#fff', 'bad', '']) {
    expect(needsNeutralGreenEdge(color), color).toBe(false);
  }
});

test('approved green treatment is case insensitive', () => {
  expect(needsNeutralGreenEdge('#80CBC4')).toBe(true);
});

test('green event uses neutral text and visible perimeter without changing approved blue/lavender', async ({ page }) => {
  for (const color of ['green', 'lavender', 'blue']) {
    await page.goto(`/tests/harness/index.html?c=EventBlock&f=contrast-${color}`);
    await page.evaluate(() => { document.documentElement.style.setProperty('--text', '#575279'); document.documentElement.style.setProperty('--bg', '#faf4ed'); });
    const card = page.locator('.ev');
    await expect(card).toBeVisible();
    if (color === 'green') {
      await expect(card).toHaveClass(/neutral-green/);
      await expect(card).toHaveCSS('color', 'rgb(87, 82, 121)');
      const edge = await card.evaluate(el => getComputedStyle(el).getPropertyValue('--event-edge').trim());
      expect(edge).toContain('32%');
    } else {
      await expect(card).not.toHaveClass(/neutral-green/);
      const edge = await card.evaluate(el => getComputedStyle(el).getPropertyValue('--event-edge').trim());
      expect(edge).toContain('27.5%');
    }
  }
});

for (const dark of [false, true]) {
  test(`green RSVP meaning survives tint and transparency in ${dark ? 'dark' : 'light'} mode`, async ({ page }) => {
    for (const state of ['needsAction', 'declined', 'tentative']) {
      await page.goto(`/tests/harness/index.html?c=EventBlock&f=contrast-green-${state}`);
      await page.evaluate(d => {
        const root = document.documentElement;
        root.style.setProperty('--text', d ? '#e8e8ea' : '#575279');
        root.style.setProperty('--bg', d ? '#17171a' : '#faf4ed');
        root.dataset.eventTransparency = '25';
        root.style.setProperty('--event-fill-opacity', '75%');
      }, dark);
      const card = page.locator('.ev');
      await expect(card).toBeVisible();
      await expect(card).toHaveClass(/neutral-green/);
      if (state === 'needsAction') await expect(card).toHaveCSS('border-top-style', 'dashed');
      if (state === 'declined') await expect(card.locator('b').first()).toHaveCSS('text-decoration-line', 'line-through');
      if (state === 'tentative') {
        const image = await card.evaluate(el => getComputedStyle(el).backgroundImage);
        expect(image).toContain('repeating-linear-gradient');
      }
    }
  });
}
