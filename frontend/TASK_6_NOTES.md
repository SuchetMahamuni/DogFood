# HACKATHON DATA OBSERVATION

**Issue:** Currently only one hackathon is visible.

**Investigation:** 
- The frontend `eventService.getEvents()` fetches `/api/events/` and returns the data directly without truncating the array.
- The `EventsPage.tsx` maps over all events returned by `getEvents()` and renders a card for each, based on the status filter (default 'ALL').
- There is no hardcoded limitation on the frontend forcing only one hackathon to display.
- Conclusion: The backend is currently returning only one seeded hackathon event.

**Action Required for Task 6 / Member 1:**
- Please seed additional mock/historical hackathons into the backend database to populate the "My Hackathons" history and the main Hackathons list.
- The UI is designed to iterate over and display multiple hackathons out-of-the-box once the API returns them.
  
## HACKATHON EXPERIENCE IN PROFILE  
**Issue:** The user requested adding a Hackathon Experience section to teammate profiles and the main user profile showing Hackathons participated, Hackathons won, Best result, and Recent hackathons.  
**Investigation:** The current backend API / data model does not provide any fields or relational data to calculate these achievements safely.  
**Action Required:**  
- Expand the backend API to return hackathon participation history and achievement metrics for a user profile. 
