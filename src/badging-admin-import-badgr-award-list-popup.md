# Badging Admin Import Badgr Award List Popup
Lightroom popup to initiate import of CSV for an award list exported from Badgr

## Required Elements
Name:
> Badging Admin Import Badger Award List Popup

| Type                 | Name                                       | Parent Element    | Attributes                                        |
|----------------------|--------------------------------------------|-------------------|--------------------------------|
| Lightbox             | badgingAdminImportBadgrAwardListLightbox   | Root              | Hidden: false, Collapsed: false |
| Text                 | importPopupTitle                           | Lightbox          | Text: "IMPORT BADGR AWARD LIST", Hidden: false, Collapsed: false |
| Dropdown             | badgeTypeDropdown                          | Lightbox          | Text: "Select Badge Type", Hidden: false, Collapsed: false, Enabled: true    |
| Upload Button        | uploadFileBtn                              | Lightbox          | Text: "Select CSV File", Hidden: true, Collapsed: false |
| Text                 | importPopupStatus                          | Lightbox          | Text: "Status", Hidden: true, Collapsed: false |
| Button               | closeBtn                                   | Lightbox          | Text: "X", Hidden: false, Collapsed: false |
| Button               | importPopupImportBtn                       | Lightbox          | Text: "Import", Hidden: false, Collapsed: false, Enabled: false |
