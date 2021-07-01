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

## Databases


### Users
* title: title: Text (primary)
* Region: Text

### Regions
* title: title: Text (primary)

### BadgesBrief
* title: title: Text (primary)
* ShortDescription: shortDescription: Text
* imageUrl: imageUrl: Media Gallery entry

### BadgesDetailed
* title: title: Text (primary)
* detailedDesctiption: detailedDesctiption: Text

### AwardedBadges
ID is a system-generated unique ID. This is leveraged to make search result entries unique. SequenceID is needed as a primary key for this table (as ID can't be set as the primary key, for some reason...).
* sequenceID: title: Text (primary)
* ID: _id: Text
* UserName: userName: Text
* BadgeName: badgeName: Text

## Repository Structure
As (to this author's knowledge) Wix does not interact "well" with git/GitHub, the Wix content is represented in GitHub as follows:
* Wix page content is described under *src/[page name].md*
* JS for pages is described under *src/js/[page name].js*

## Installation
+ Create pages in Wix reflecting each page described in this repository (under */src/[page name].md*)
+ Copy the JS for each page into Wix
* Copy the images for the badges into the Media Gallery
* Manually create the databases in Wix
  * Set the badge images to refer to the correct badge image from the Media Gallery

## ToDos
+ <del>Set up github repository
+ <del>Prune/hide learner personal pages
+ Pretty list design for single badge search result list entry
+ Migrate code to VH Preview site
+ Prettify search page
+ Prettify search results list page
+ Search results page - show badges as repeater
+ Change DBs (esp awardedbadges) to use references instead of text names
+ <del>Standardize DB field names
+ Add analytics (GA?)
  * See if DB setup/description/instantiation can be programmatic instead of manual
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
    + IP address tracking fo sender (to catch abuse?)
    + Cookie tracking of sender (to catch abuse?) - would need Cookie permission interstitial...
+ Data import
    + Validate that GSheets supports templates
    + Validate whether GSheets supports list/entry validation from a master file
    + GSheet template for manual (non-GClassroom) user/course entry, with validated email addresses and region selection
    + Make test folder in git
    + Save sample GClassroom data import files
    + Architect import system
        + Users (need to de-dup)
        + Courses
+ Data Recovery
   + Add transaction logging DBs to all DB import paths to allow recovery of state on an import fail or corruption. 
  