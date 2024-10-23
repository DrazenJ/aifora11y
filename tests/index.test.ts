import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import OpenAI from 'openai';

const openai = new OpenAI({
  organization: process.env.VITE_ORGANIZATION,
  project: process.env.VITE_PROJECT,
  apiKey: process.env.VITE_OPENAI_API_KEY
});

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Language level should be B2 or lower', async ( { page }) => {
    await page.goto('http://localhost:5173/');

    const content = await page.evaluate(() => document.body.innerText);

    const prompt = `Analyze the following text and return the reading grade level and CEFR level:
      "${content}"
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: [{ "type": "text", "text": prompt }] }],
      model: "gpt-3.5-turbo-0125"
    });

    const responseText = completion.choices[0].message.content;
    
    const gradeLevel = /Grade Level:\s*(\d+)/i.exec(responseText as string)?.[1];
    const cerfLevel = /CEFR Level:\s*(\w+)/i.exec(responseText as string)?.[1];

    console.log('cerfLevel: ', cerfLevel);
    console.log('gradeLevel: ', gradeLevel);

    const numericGradeLevel = gradeLevel ? parseInt(gradeLevel) : null;
    expect(numericGradeLevel).toBeLessThanOrEqual(12);
    expect(cerfLevel).toMatch(/(B2|B1|A2|A1)/);

  });
});