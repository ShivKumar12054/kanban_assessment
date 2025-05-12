import { Page, Locator } from "@playwright/test";
import { Helper } from '../../utils/helper'

export class KanbanMainPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async allHeading() {
    return await this.page.locator('[class="text-medium-grey font-bold text-xs uppercase"]').allInnerTexts()
  }

  async getAllSubtasks() {
    return (await this.page.locator('[class="bg-white dark:bg-dark-grey rounded-lg p-1"] label').allInnerTexts()).map(i => i.trim())
  }

  async getStrikedTasks() {
     return (await this.page.locator('[class="bg-white dark:bg-dark-grey rounded-lg p-1"] .line-through').allTextContents()).map(i => i.trim())
  }

  async getNotCompletedTasks() {
    const allSubtasks = await this.getAllSubtasks()
    const allStrickedTasks = await this.getStrikedTasks()
    return allSubtasks.filter(i => !allStrickedTasks.includes(i))
  }

  async getFirstColumnText() {
    const allHeading = await this.allHeading()
    const lastText = allHeading[0].trim()
    const firstColText =  lastText.match(/^([A-Z]+)\s*\(\s*(\d+)\s*\)/)
    if(!firstColText) {
      throw new Error('first text is Null!!!')
    }
    return firstColText[1]
  }

  async getNumberOfTasksOnFirstColumn() {
    const allHeading = await this.allHeading()
    const lastText = allHeading[0].trim()
    const firstColText =  lastText.match(/^([A-Z]+)\s*\(\s*(\d+)\s*\)/)
    if(!firstColText) {
      throw new Error('first text is Null!!!')
    }
    return Number(firstColText[2])
  }

  async print() {
    console.log(await this.getFirstColumnText())
    console.log(await this.getNumberOfTasksOnFirstColumn())
    // await this.clickOnSubTask()
    // await this.clickNonCompletedTask()
    console.log("strick man->", await this.getStrikedTasks())
    console.log("strick man->", await this.getAllSubtasks())
    console.log('non com task', await this.getNotCompletedTasks())
  }

  async clickOnSubTask() {
    const elements = await this.page.locator('//p[@class="text-xs text-medium-grey font-bold select-none"]');
    const count = await elements.count()
    const startIndex = await this.getNumberOfTasksOnFirstColumn()
    console.log('count', count)

        for (let i = startIndex; i < count; i++) {
          const text = await elements.nth(i).innerText(); // or .textContent()
          console.log('text', text)
          const match = text.match(/(\d+)\s+of\s+(\d+)\s+substasks/i);
          console.log('match', match)

              if (match) {
                const completed = parseInt(match[1], 10);
                const total = parseInt(match[2], 10);
                console.log(completed, total)

                      if (completed < total) {
                        const firstIncompleteLocator = elements.nth(i);
                        console.log(`Found: ${text}`);
                        // Do something with the locator:
                        await firstIncompleteLocator.click(); // example
                        break;
                      }
              }
        }

  }

  async clickNonCompletedTask() {
    const nonCompletedTasks = await this.getNotCompletedTasks()
    await this.page.getByText(nonCompletedTasks[0]).click()
    
  }

}