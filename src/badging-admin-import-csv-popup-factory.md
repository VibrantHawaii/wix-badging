# Badging Admin Import CSV Popup Factory
Lightroom popup to initiate import of CSV for a variety of types of class (offline class, Learnable course)

## Required Elements
Name:
> Badging Admin Import CSV Popup Factory

| Type                 | Name                                   | Parent Element    | Attributes                                        |
|----------------------|----------------------------------------|-------------------|--------------------------------|
| Lightbox             | badgingAdminImportCSVFactoryLightbox   | Root              | Hidden: false, Collapsed: false |
| Button               | closeBtn                               | Lightbox          | Text: "X", Hidden: false, Collapsed: false |
| Text                 | importPopupTitle                       | Lightbox          | Text: "IMPORT CSV", Hidden: false, Collapsed: false |
| Dropdown             | badgeTypeDropdown                      | Lightbox          | Text: "Select Badge Type", Hidden: false, Collapsed: false, Enabled: true    |
| Upload Button        | uploadFileBtn                          | Lightbox          | Text: "Select CSV File", Hidden: true, Collapsed: false |
| Text                 | importPopupStatus                      | Lightbox          | Text: "Status", Hidden: true, Collapsed: false |
| Check Box            | eulaAcceptedCheckbox                   | Lightbox          | Test: "User Agreement accepted", Hidden: false, Collapsed: false, Enabled: true |
| Text                 | eulaVersionPrompt                      | Lightbox          | Text: "Version:", Hidden: true, Collapsed: false |
| Dropdown             | eulaVersionDate                        | Lightbox          | Hidden: true, Collapsed: false, Enabled: true    |
| Button               | importPopupImportBtn                   | Lightbox          | Text: "Import", Hidden: false, Collapsed: false, Enabled: false |
