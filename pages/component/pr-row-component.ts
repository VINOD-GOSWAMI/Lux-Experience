import { Locator, Page } from "@playwright/test";
import { PRRowData } from "../../types/PullRequest";
import { BaseComponent } from "./base-component";


export class PRRowComponent extends BaseComponent{
    private readonly row;

    constructor(row: Locator) {
      super(row.page());
      this.row = row;
    }

  /** PR title link — accessible */
  private get title() {
    return this.row.locator('a.markdown-title');
  }


  /** Author link — using CSS + accessible filter */
  private get authorLink() {
    return this.row.locator('//span[@class="opened-by"]//a');
  }

  /** Created at — not accessible, fallback */
  private get createdAtLocator() {
    return this.row.locator('//span[@class="opened-by"]//relative-time');
  }

  /** PR number */
  private get openedBy() {
    return this.row.locator(".opened-by");
  }

  /** Extractors */
  async getTitle(): Promise<string> {
    return await this.title.innerText();
  }

  async getNumber(): Promise<string> {
    const text = await this.openedBy.innerText();
    return (text.match(/#\d+/) ?? [""])[0];
  }

  async getCreatedAt(): Promise<string> {
    try {
      return (
        (await this.row.evaluate((node) => {
          const el = node.querySelector(
            'span.opened-by relative-time'
          ) as HTMLElement | null;
          return el?.getAttribute('datetime') || '';
        })) || ""
      );
    } catch {
      return "";
    }
  }

  async getAuthor(): Promise<string> {
    return (await this.authorLink.innerText()) ?? "";
  }

  async toJSON(): Promise<PRRowData> {
    return {
      title: await this.getTitle(),
      number: await this.getNumber(),
      createdAt: await this.getCreatedAt(),
      author: await this.getAuthor(),
    };
  }
}

