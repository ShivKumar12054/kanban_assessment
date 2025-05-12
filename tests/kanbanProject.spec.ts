import test, { expect, Locator } from "@playwright/test";
import { KanbanMainPage } from "../pageObjects/kanbanPage/kanbanMainPage";
import { Helper } from '../utils/helper'

test('get started link', async ({ page }) => {

const kanban = new KanbanMainPage(page);
const helper = new Helper(page)

await page.goto("https://kanban-566d8.firebaseapp.com/");



await helper.sleep(5)
await kanban.print()
await kanban.clickOnSubTask()
await helper.sleep(5)
await kanban.clickNonCompletedTask()
await helper.sleep(5)






});
