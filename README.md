# wix-badging
Badging system built within the Wix infrastructure

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
