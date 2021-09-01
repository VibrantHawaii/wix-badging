# Badging Administration Page
Page to perform administration of badging.

## Hide from menu (in Page Settings -> Page Info)
False

## Page URL Slug (in Page Settings -> SEO -> Search (Google))
badging-administration

## Required Elements
| Type                 | Name                       | Parent Element    | Attributes                                        |
|----------------------|----------------------------|-------------------|--------------------------------|
| Text                 | administrationTitle        | Root/Any          | Text: "BADGING ADMINISTRATION", Hidden: false, Collapsed: false |
| Button               | importTeachableCourseBtn   | Root/Any          | Text: "Import CSV for Teachable Course", Hidden: false, Collapsed: false, Enabled: true, Link: Lightbox: "" |
| Button               | importBadgrCVSBtn          | Root/Any          | Text: "Import Badgr Award CSV", Hidden: false, Collapsed: false, Enabled: true, Link: Lightbox: "Badging Admin Import CSV Popup"    |
| Button               | importOfflineClassBtn      | Root/Any          | Text: "Import CSV for Offline Class", Hidden: false, Collapsed: false, Enabled: true, Link: Lightbox: "Badging Admin Import Badge Awards Popup" |
