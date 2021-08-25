# Badging Admin Add A Learner Popup Lightroom
Lightroom popup to enable to add a new learner

## Required Elements
Name:
> Badging Admin Add A Learner Popup

| Type                 | Name                       | Parent Element    | Attributes                                        |
|----------------------|----------------------------|-------------------|--------------------------------|
| ContainerBox         | box1                       | Lightbox          | Hidden: false, Collapsed: false |
| Text                 | title                      | box1              | Text: "ADD A LEARNER", Hidden: false, Collapsed: false |
| Text                 | status                     | box1              | Text: "Status", Hidden: true, Collapsed: false |
| Button               | closeBtn                   | box1              | Text: "X", Hidden: false, Collapsed: false |
| Input                | learnerNameInput           | box1              | Text: "Name", Hidden: false, Collapsed: false, Enabled: true |
| Input                | learnerEmailInput          | box1              | Text: "Email Address", Hidden: false, Collapsed: false, Enabled: true, Settings->Type: Email |
| Text                 | supportedRegionsPrompt     | box1              | Text: "Which regions of the island can they provide support for? (click to de-select):", Hidden: true, Collapsed: false |
| Table                | regionsTable               | box1              | Columns: ("Supported:supported, "Region":region), Clicking selects: Rows, Resize Table Height: Automatically, Show Header Row: off, 
| Check Box            | eulaAcceptedCheckbox       | box1              | Test: "User Agreement accepted", Hidden: false, Collapsed: false, Enabled: true |
| Text                 | eulaVersionPrompt          | box1              | Text: "Version:", Hidden: true, Collapsed: false |
| Dropdown             | eulaVersionDate            | box1              | Hidden: true, Collapsed: false, Enabled: true    |
| Button               | submitBtn                  | box1              | Text: "Submit", Hidden: true, Collapsed: false, Enabled: false |
