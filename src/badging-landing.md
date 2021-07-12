# Search Page
Page to initiate a search for learners by region or awarded badge.

## Hide from menu (in Page Settings -> Page Info)
False

## Page URL Slug (in Page Settings -> SEO -> Search (Google)
badging-landing

## Required Elements
| Type                 | Name                   | Parent Element    | Attributes                                        |
|----------------------|------------------------|-------------------|--------------------------------|
| Dropdown             | searchByRegion         | Root/Any          | Hidden: false, Collapsed: false, Enabled: true    |
| Dropdown             | searchByBadge          | Root/Any          | Hidden: false, Collapsed: false, Enabled: true    |
| Button               | searchBtn              | Root/Any          | Hidden: false, Collapsed: false, Enabled: true, onClick Event Handler: searchBtn_click    |
