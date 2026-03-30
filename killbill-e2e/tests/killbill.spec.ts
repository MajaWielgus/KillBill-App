import { test, expect } from '@playwright/test';

test('Pełna ścieżka E2E: Rejestracja, logowanie i dodanie subskrypcji', async ({ page }) => {
  // 1. Zmienne (unikalny login gwarantuje, że test przejdzie wielokrotnie)
  const unikalnyLogin = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const haslo = 'Haslo123!';

  // 2. Wejście na stronę i nawigacja do rejestracji
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Zacznij za darmo' }).click();
  await page.getByRole('button', { name: 'Załóż darmowe konto' }).click();

  // 3. Rejestracja
  await page.getByRole('textbox', { name: 'Login' }).fill(unikalnyLogin);
  await page.getByRole('textbox', { name: 'Hasło' }).fill(haslo);
  await page.getByRole('button', { name: 'Zarejestruj się ✨' }).click();

  // --- NAPRAWA BŁĘDU: Usypiamy robota na 2 sekundy, 
  // żeby darmowa baza MongoDB zdążyła zapisać nowego użytkownika ---
  await page.waitForTimeout(2000);
  
  // 4. Logowanie
  await page.getByRole('textbox', { name: 'Login' }).fill(unikalnyLogin);
  await page.getByRole('textbox', { name: 'Hasło' }).fill(haslo);
  await page.getByRole('button', { name: 'Zaloguj się 🚀' }).click();

  // --- ASERCJA 1: Sprawdzenie, czy po zalogowaniu jesteśmy w aplikacji ---
  await expect(page.getByRole('textbox', { name: 'Nazwa (np. Netflix)' })).toBeVisible();

  // 5. Dodanie pierwszej subskrypcji (Netflix)
  await page.getByRole('textbox', { name: 'Nazwa (np. Netflix)' }).fill('Netflix');
  await page.getByPlaceholder('Cena').fill('40');
  await page.locator('select[name="category"]').selectOption('Rozrywka');
  await page.locator('input[name="date"]').fill('2026-03-31');
  await page.getByRole('button', { name: 'Dodaj' }).click();

  // --- ASERCJA 2: Sprawdzenie, czy Netflix jest na liście ---
 await expect(page.getByText('Netflix').first()).toBeVisible();

  // 6. Dodanie drugiej subskrypcji (Duolingo)
  await page.getByRole('textbox', { name: 'Nazwa (np. Netflix)' }).fill('Duolingo');
  await page.getByPlaceholder('Cena').fill('200');
  await page.locator('select[name="frequency"]').selectOption('yearly');
  await page.locator('select[name="category"]').selectOption('Praca');
  await page.locator('input[name="date"]').fill('2026-03-11');
  await page.getByRole('button', { name: 'Dodaj' }).click();

  // --- ASERCJA 3: Sprawdzenie, czy Duolingo jest na liście ---
  await expect(page.getByText('Duolingo').first()).toBeVisible();

});