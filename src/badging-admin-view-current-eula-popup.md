# Badging Admin View Current EULA Popup Lightroom
Lightroom popup to view the current (latest saved) User Agreement

## Required Elements
Name:
> Badging Admin View Current EULA Popup

| Type                 | Name                       | Parent Element    | Attributes                                        |
|----------------------|----------------------------|-------------------|--------------------------------|
| ContainerBox         | box1                       | Lightbox          | Hidden: false, Collapsed: false |
| Text                 | title                      | box1              | Text: "CURRENT USER AGREEMENT", Hidden: false, Collapsed: false |
| Text                 | prompt                     | box1              | Text: "User Agreement as of:", Hidden: false, Collapsed: false |
| Text                 | eulaText                   | Root/Any          | Text: "EULA", Hidden: false, Collapsed: false |
| Button               | closeBtn                   | box1              | Text: "X", Hidden: false, Collapsed: false |
