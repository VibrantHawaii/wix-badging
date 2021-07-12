# Badging Administration Page
Page to perform administration of badging.

## Hide from menu (in Page Settings -> Page Info)
False

## Page URL Slug (in Page Settings -> SEO -> Search (Google))
badging-administration

## Required Elements
| Type                 | Name                   | Parent Element    | Attributes                                        |
|----------------------|------------------------|-------------------|--------------------------------|
| Text                 | administrationTitle    | Root/Any          | Text: "BADGING ADMINISTRATION", Hidden: false, Collapsed: false |
| Button               | importOfflineClassBtn  | Root/Any          | Text: "Import CSV for Offline Class", Hidden: false, Collapsed: false, Enabled: true, onClick Event Handler: searchBtn_click    |
