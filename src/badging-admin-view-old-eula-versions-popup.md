# Badging Admin View Old EULA Versions Popup Lightroom
Lightroom popup to view all versions of the User Agreement

## Required Elements
Name:
> Badging Admin View Old EULA Versions Popup

| Type                 | Name                       | Parent Element    | Attributes                                        |
|----------------------|----------------------------|-------------------|--------------------------------|
| ContainerBox         | box1                       | Lightbox          | Hidden: false, Collapsed: false |
| Text                 | title                      | box1              | Text: "CURRENT USER AGREEMENT", Hidden: false, Collapsed: false |
| Text                 | prompt                     | box1              | Text: "User Agreement as of:", Hidden: false, Collapsed: false |
| Dropdown             | selectDate                 | box1              | Hidden: false, Collapsed: false, Enabled: true    |
| Text                 | eulaText                   | box1              | Text: "Select a date to view the User Agreement", Hidden: false, Collapsed: false |
| Button               | closeBtn                   | box1              | Text: "X", Hidden: false, Collapsed: false |
