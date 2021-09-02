# Badging Enroll Learner Popup Lightroom
Lightroom popup to enable to enroll Learner in a class

## Required Elements
Name:
> Badging Enroll Learner Popup

| Type                 | Name                       | Parent Element    | Attributes                                        |
|----------------------|----------------------------|-------------------|--------------------------------|
| ContainerBox         | box1                       | Lightbox          | Hidden: false, Collapsed: false |
| Text                 | enrollLearnerTitle         | box1              | Text: "ENROLL", Hidden: false, Collapsed: false |
| Text                 | enrollLearnerStatus        | box1              | Text: "Status", Hidden: true, Collapsed: false |
| Button               | closeBtn                   | box1              | Text: "X", Hidden: false, Collapsed: false |
| Button               | enrollLearnerSubmitBtn     | box1              | Text: "Submit", Hidden: true, Collapsed: false, Enabled: false |
| Input                | enrollLearnerNameInput     | box1              | Text: "Add your Name", Hidden: false, Collapsed: false, Enabled: true |
| Input                | enrollLearnerEmailInput    | box1              | Text: "Add your Email Address", Hidden: false, Collapsed: false, Enabled: true, Settings->Type: Email |
| reCAPTCHA            | enrollLearnerCaptcha       | box1              | Hidden: true, Collapsed: false       |
| Text                 | supportedRegionsPrompt     | box1              | Text: "Please tell us which regions of the island you can provide support for (click to de-select):", Hidden: true, Collapsed: false |
| Table                | enrollLearnerRegionsTable  | box1              | Columns: ("Supported:supported, "Region":region), Clicking selects: Rows, Resize Table Height: Automatically, Show Header Row: off, 
| Text                 | eulaTitle                  | box1              | Text: "Learner Agreement", Hidden: true, Collapsed: false |
| ContainerBox         | eulaBox                    | box1              | Hidden: true, Collapsed: false |
| Text                 | eualText                   | eulaBox           | Text: "", Hidden: true, Collapsed: false |
| Checkbox             | eulaAcceptedCheckbox       | box1              | Text: "I agree to the terms of the Learner agreement", Hidden: true, Collapsed: false. Enabled: true |
| Button               | enrollLearnerEnrollBtn     | box1              | Text: "Enroll", Hidden: true, Collapsed: false, Enabled: false |
