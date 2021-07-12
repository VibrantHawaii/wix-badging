# Badging Admin Import Offline Class Popup
Lightroom popup to initiate import of CSV for an offline class

## Required Elements
Name:
> Badging Admin Import Offline Class Popup

| Type                 | Name                                   | Parent Element    | Attributes                                        |
|----------------------|----------------------------------------|-------------------|--------------------------------|
| Lightbox             | badgingAdminImportOfflineClassLightbox | Root              | Hidden: false, Collapsed: false |
| Text                 | importPopupTitle                       | Lightbox          | Text: "IMPORT OFFLINE CLASS", Hidden: false, Collapsed: false |
| Dropdown             | badgeTypeDropdown                      | Lightbox          | Text: "Select Badge Type", Hidden: false, Collapsed: false, Enabled: true    |
| Upload Button        | uploadFileBtn                          | Lightbox          | Text: "Select CSV File", Hidden: true, Collapsed: false |
| Text                 | importPopupStatus                      | Lightbox          | Text: "Status", Hidden: true, Collapsed: false |
| Button               | closeBtn                               | Lightbox          | Text: "X", Hidden: false, Collapsed: false |
| Button               | importPopupImportBtn                   | Lightbox          | Text: "Import", Hidden: false, Collapsed: false, Enabled: false |
