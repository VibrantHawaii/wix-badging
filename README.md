# wix-badging
Badging system built within the Wix infrastructure.

This system is designed to meet Vibrant Hawaii's specific requirements:
* Publicly viewable
* Searchable based on learner region and awarded badges
* Privacy-aware way for the public to contact learners (with no direct exposure of learner's email address)
* Ability to populate via import from Google Classroom CSV exports
* Ability to populate via import from Google Sheets (template) log of attendees at a workshop/class

## Assumptions
Learners awarded badges must supply a first and last name, email address, and region (and give permission for VH to use those)

## Design Philosophy
Simple and clear administrative interfaces.

Perform de-duplication and validation to identify data import errors before the data is introduced into the system.

## ToDos
+ <del>Set up github repository
+ Prune/hide learner personal pages
+ Pretty list design for single badge search result list entry
+ Migrate code to VH Preview site
+ Prettify search page
+ Prettify search results list page
+ Add analytics (GA?)
+ Contact learner capability
    + Add button
    + Ensure PII user DB is separate and only accessible by backend
    + New DB to track transactions (issue unique key for each contact button instance, revoke when used)
    + Contact Learner dialog
    + Create JS email provider account
    + Test email sending with basic implementation
    + Send email from backend
    + Revoke unique token when email sent
    + Check unique tokens when email request issued
* Data import
    + Validate that GSheets supports templates
    + Validate whether GSheets supports list/entry validation from a master file
    + GSheet template for manual (non-GClassroom) user/course entry, with validated email addresses and region selection
    + Make test folder in git
    + Save sample GClassroom data import files
    + Architect import system
        * Users (need to de-dup)
        * Courses
* Data Recovery
   * Add transaction logging DBs to all DB import paths to allow recovery of state on an import fail or corruption. 
  