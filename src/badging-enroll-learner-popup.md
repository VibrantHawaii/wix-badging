# Badging Enroll Learner Popup Lightroom
Lightroom popup to enable to enroll Learner in a class

## Required Elements
Name:
> Badging Enroll Learner Popup

| Type                 | Name                           | Parent Element                | Attributes                                        |
|----------------------|--------------------------------|-------------------------------|--------------------------------|
| Text                 | enrollLearnerTitle             | Lightbox                      | Text: "ENROLL", Hidden: false, Collapsed: false |
| Text                 | enrollLearnerStatus            | Lightbox                      | Text: "Status", Hidden: true, Collapsed: false |
| Button               | closeBtn                       | Lightbox                      | Text: "X", Hidden: false, Collapsed: false |
| Input                | enrollLearnerNameInput         | Lightbox                      | Text: "Add your Name", Hidden: false, Collapsed: false, Enabled: true |
| Input                | enrollLearnerEmailInput        | Lightbox                      | Text: "Add your Email Address", Hidden: false, Collapsed: false, Enabled: true, Settings->Type: Email |
| ContainerBox         | captchaAndSubmitContainerBox   | Lightbox                      | Hidden: false, Collapsed: false |
| Button               | enrollLearnerSubmitBtn         | captchaAndSubmitContainerBox  | Text: "Submit", Hidden: true, Collapsed: false, Enabled: false |
| reCAPTCHA            | enrollLearnerCaptcha           | captchaAndSubmitContainerBox  | Hidden: true, Collapsed: false       |
| ContainerBox         | regionContainerBox             | Lightbox                      | Hidden: true, Collapsed: true |
| Text                 | supportedRegionsPrompt         | regionContainerBox            | Text: "Please tell us which regions of the island you can provide support for (click to de-select):", Hidden: true, Collapsed: false |
| Table                | enrollLearnerRegionsTable      | regionContainerBox            | Columns: ("Supported:supported, "Region":region), Clicking selects: Rows, Resize Table Height: Automatically, Show Header Row: off, 
| ContainerBox         | eulaContainerBox               | Lightbox                      | Hidden: true, Collapsed: true |
| Text                 | eulaTitle                      | eulaContainerBox              | Text: "Learner Agreement", Hidden: true, Collapsed: false |
| ContainerBox         | eulaBox                        | eulaContainerBox              | Hidden: true, Collapsed: false |
| Text                 | eualText                       | eulaBox                       | Text: "", Hidden: true, Collapsed: false |
| Checkbox             | eulaAcceptedCheckbox           | eulaContainerBox              | Text: "I agree to the terms of the Learner agreement", Hidden: true, Collapsed: false. Enabled: true |
| ContainerBox         | enrollBtnContainerBox          | Lightbox                      | Hidden: true, Collapsed: true |
| Button               | enrollLearnerEnrollBtn         | enrollBtnContainerBox         | Text: "Enroll", Hidden: true, Collapsed: false, Enabled: false |
