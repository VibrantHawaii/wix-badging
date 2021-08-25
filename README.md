# wix-badging
Badging system built within the Wix infrastructure.

This system is designed to meet Vibrant Hawaii's specific requirements:
* Publicly viewable
* Searchable based on learner region and awarded badges
* Privacy-aware way for the public to contact learners (with no direct exposure of learner's email address)
* Ability to populate via import from Google Classroom CSV exports
* Ability to populate via import from Google Sheets (template) log of attendees at a workshop/class

<strong style="color: red;">NOTE: this architecture requires Wix APIs that are NOT available if Editor X is enabled for the Wix site.</strong>

## Assumptions
Learners awarded badges must supply a first and last name, email address, and supported regions (and give permission for VH to use those)

## Design Philosophy
Simple and clear administrative interfaces.

Perform de-duplication and validation to identify data import errors before the data is introduced into the system.

## Databases
### Badging-Users
* userToken: title: Text (primary): has of user name and email address. Used for uniqueness verification. See badging-utils.js->generateUserToken()
* supportedRegionsRef: supportedRegionsRef: Reference -> Badging-Regions (multiple)
* eulaRef: eulaRef: Reference -> Badging-EULA

### Badging-Users-PII
**IMPORTANT: Set the collection use as _Private Data_**
* sequenceID: title: Text (primary)
* userRef: userRef: Reference -> Badging-Users
* email: email: Text (mark as PII and thus encrypted)

### Badging-Regions
* title: title: Text (primary)

### Badging-BadgesBrief
* title: title: Text (primary)
* ShortDescription: shortDescription: Text
* imageUrl: imageUrl: Media Gallery entry

### Badging-BadgesDetailed
* title: title: Text (primary) _this is only needed as a primary key, and is otherwise ignored_
* detailedDescription: detailedDescription: Rich text
* badgeRef: badgeRef: Reference -> Badging-BadgesBrief

### Badging-AwardedBadges
ID is a system-generated unique ID. This is leveraged to make search result entries unique. SequenceID is needed as a primary key for this table (as ID can't be set as the primary key, for some reason...).
* sequenceID: title: Text (primary)
* ID: _id: Text
* userRef: userRef: Reference -> Badging-Users
* badgeRef: badgeRef: Reference -> Badging-BadgesBrief
* awardedDate: awardedDate: Date and Time
* expiryDate: expiryDate: Date and Time

### Badging-Enrollment
* userRef: userRef: Reference -> Badging-Users
* badgeRef: badgeRef: Reference -> Badging-BadgesBrief

### Badging-EULA
This stores versions of the (rich text) EULA that Learner agree to
* title: title: Text (primary)
* text: text: Rich text

## Repository Structure
As (to this author's knowledge) Wix does not interact "well" with git/GitHub, the Wix content is represented in GitHub as follows:
* Wix page and lghtbox content is described under *src/[page name].md*
* JS for pages is described under *src/js/[page name].js*
* JS for lightboxes (popups) is described under *src/lightboxes/[page name].md*
* JS for backend modules is described under *src/js/backend/[module name].jsw*

## Installation
+ Create pages in Wix reflecting each page and ligthbox described in this repository (under */src/[page name].md*)
+ Copy the JS for each page into Wix
* [Create the backend module files in Wix](https://www.wix.com/velo/forum/coding-with-velo/creating-backend-modules-and-learn-how-to-use-them) and copy the jsw code into Wix
* Copy the images for the badges into the Media Gallery
* Manually create the databases in Wix
  * Set the badge images to refer to the correct badge image as a new Media Gallery for each badge image, containing one badge image per media gallery
* Create an account for [emailJS](https://www.emailjs.com/)
* Create a emailJS template:
    * Template ID: _badging_contact_learner_
    * Reply To: _{{enquirer_email}}_
    * Subject: _Vibrant Hawaii: New message from {{enquirer_name}}: {{enquirer_email}}_
    * Content:
> Aloha {{learner_name}},
>
>{{enquirer_name}} has sent you a message. You can reply to this email to contact them.
>
> {{message}}
>
> Mahalo, Vibrant Hawaii

* In the emailJS _Settings_ tab, under _API Settings_, check both _"Allow EmailJS API for non-browser applications"_ and _"User access tokens (recommended)"_
* Obtain your user ID and access token from the [integration](https://dashboard.emailjs.com/admin/integration) page in the EmailJS dashboard
* Save the emailJS user ID in the Wix Secrets Manager (under Wix site->Settings->Advanced) with the name:
> emailJS_user_ID

* Save the emailJS access token in the Wix Secrets Manager (under Wix site->Settings->Advanced) with the name:
>  emailJS_accessToken

* Save the emailJS service ID to user for sending emails to Learners in the Wix Secrets Manager (under Wix site->Settings->Advanced) with the name:
> emailJS_service_ID

## ToDos
+ change user->learner everywhere
+ Add EULA acceptance and version to bulk imports
+ Add EULA acceptance and version to enroll learner popup
+ investigate if badge images should be images instead of media galleries
+ Override supported regions with latest info on user import from any source
+ Page: List of all badges
+ Categorize badges contributor vs curious
+ Remove badgesdetailed title
+ Make clicking on any badge in search results, including text, go to badge details page
+ Enroll user flow
    + If EULA record not in system then prompt for checkbutton acknowledgement of EULA
+ Add analytics (Wix)
  * See if DB setup/description/instantiation can be programmatic instead of manual
+ Contact learner capability
    + Catch error conditions on email send
    + New DB to track transactions (issue unique token for each contact button instance, revoke when used)
    + Revoke unique token when email sent
    + Check unique tokens when email request issued
    + IP address tracking for sender (to catch abuse?)
    + Cookie tracking of sender (to catch abuse?) - would need Cookie permission interstitial...
+ Data import
    + <del>Validate that GSheets supports templates: [*It does, click here to learn  more.*](https://support.google.com/docs/answer/148833?co=GENIE.Platform%3DDesktop&hl=en#zippy=%2Csubmit-a-template)
    + Make test folder in git
    + Save sample GClassroom data import files
    + Create admin-only viewable administration interface
        + Set permissions to [only subsets of Wix account roles](https://support.wix.com/en/article/limiting-pages-on-your-site-to-specific-member-roles) (currently any logged in user can see the admin page)
        + DB management
          + Badge CRUD
          + Badgr-style user import/enrollment 
          + Manual Learner RUD           
          + Manual AwardedBadge CRUD           
            + Awarded badge Read showing issue and expiry dates
+ Data Recovery
   + Add transaction logging DBs to all DB import paths to allow recovery of state on an import fail or corruption. 
  