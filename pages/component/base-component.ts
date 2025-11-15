
import { Page } from '@playwright/test';

export class BaseComponent{
    readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}