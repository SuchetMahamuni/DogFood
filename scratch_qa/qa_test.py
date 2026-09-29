import asyncio
from playwright.async_api import async_playwright

async def run_qa():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        print("=== STARTING QA SCRIPT ===")
        
        print("1. Loading frontend...")
        await page.goto("http://localhost:5173/")
        await page.wait_for_load_state("networkidle")
        print("Title:", await page.title())

        print("2. Clicking Login...")
        await page.click("text=Login")
        await page.wait_for_selector("input[type='email']")

        print("3. Logging in as participant...")
        await page.fill("input[type='email']", "participant1@example.com")
        await page.fill("input[type='password']", "password123")
        await page.click("button[type='submit']")
        
        await page.wait_for_url("**/dashboard")
        print("Successfully reached dashboard.")

        print("4. Checking Dashboard...")
        dashboard_content = await page.content()
        if "Participant 1" in dashboard_content or "Participant" in dashboard_content:
            print("User name/role is visible.")

        print("5. Navigating to Teams...")
        await page.click("text=Teams")
        await page.wait_for_load_state("networkidle")
        print("Teams page loaded.")
        
        print("6. Creating a team...")
        await page.click("text=Create Team")
        await page.wait_for_selector("input[placeholder='e.g. Quantum Hackers']")
        await page.fill("input[placeholder='e.g. Quantum Hackers']", "The Automators")
        await page.click("button:has-text('Create Team')")
        
        await page.wait_for_timeout(2000)
        teams_content = await page.content()
        if "The Automators" in teams_content:
            print("Team created successfully.")

        print("7. Navigating to Discover...")
        await page.click("text=Discover")
        await page.wait_for_load_state("networkidle")
        print("Discover page loaded.")

        print("8. Navigating to Projects...")
        await page.click("text=Projects")
        await page.wait_for_load_state("networkidle")
        print("Projects page loaded.")

        print("9. Navigating to Guidance...")
        await page.click("text=Guidance")
        await page.wait_for_load_state("networkidle")
        print("Guidance page loaded.")

        print("10. Logging out...")
        await page.click("button:has-text('PT')") # Avatar initial for Participant
        await page.click("text=Log out")
        await page.wait_for_url("**/")
        print("Successfully logged out.")

        await browser.close()
        print("=== QA SCRIPT COMPLETE ===")

if __name__ == "__main__":
    asyncio.run(run_qa())
