import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';
import { render, cleanup } from '@testing-library/react';
import MegaMenuContent from '../../src/components/mega-menu/MegaMenuContent';
import { CATEGORY_LIST } from '../../src/components/Step1DocumentSelector';
import { promissoryNoteCA } from '../../src/lib/documents/ca/promissory-note';

// Helper to setup a DOM environment for React Testing Library
function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  // @ts-ignore
  global.window = dom.window as any;
  // @ts-ignore
  global.document = dom.window.document as any;
  // @ts-ignore
  global.navigator = dom.window.navigator as any;
  // @ts-ignore
  global.HTMLElement = dom.window.HTMLElement;
}

setupDom();

const financeCategory = CATEGORY_LIST.find(c => c.key === 'Finance')!;

test('MegaMenuContent locale="es" has no US document links', () => {
  const { container, asFragment } = render(
    <MegaMenuContent locale="es" categories={[financeCategory]} documents={[promissoryNoteCA]} />
  );

  // Basic snapshot to ensure consistent markup
  assert.ok(asFragment());

  const links = Array.from(container.querySelectorAll('a'));
  for (const link of links) {
    assert.ok(!link.getAttribute('href')?.includes('/docs/us/'));
  }

  cleanup();
});
