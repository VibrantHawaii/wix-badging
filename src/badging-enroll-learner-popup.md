# Badging Enroll Learner Popup Lightroom
Lightroom popup to enable to enroll user in a class

## Required Elements
Name:
> Badging Enroll Learner Popup

| Type                 | Name                       | Parent Element    | Attributes                                        |
|----------------------|----------------------------|-------------------|--------------------------------|
| ContainerBox         | box1                       | Lightbox          | Hidden: false, Collapsed: false |
| Text                 | enrollUserTitle            | box1              | Text: "ENROLL", Hidden: false, Collapsed: false |
| Text                 | enrollUserStatus           | box1              | Text: "Status", Hidden: true, Collapsed: false |
| Button               | closeBtn                   | box1              | Text: "X", Hidden: false, Collapsed: false |
| Button               | enrollUserSubmitBtn        | box1              | Text: "Submit", Hidden: true, Collapsed: false, Enabled: false |
| Input                | enrollUserNameInput        | box1              | Text: "Add your Name", Hidden: false, Collapsed: false, Enabled: true |
| Input                | enrollUserEmailInput       | box1              | Text: "Add your Email Address", Hidden: false, Collapsed: false, Enabled: true, Settings->Type: Email |
| reCAPTCHA            | enrollUserCaptcha          | box1              | Hidden: true, Collapsed: false       |
| Text                 | supportedRegionsPrompt     | box1              | Text: "Please tell us which regions of the island you can provide support for (click to de-select):", Hidden: true, Collapsed: false |
| Table                | enrollUserRegionsTable     | box1              | Columns: ("Supported:supported, "Region":region), Clicking selects: Rows, Resize Table Height: Automatically, Show Header Row: off, 
| Button               | enrollUserEnrollBtn        | box1              | Text: "Enroll", Hidden: true, Collapsed: false, Enabled: false |
