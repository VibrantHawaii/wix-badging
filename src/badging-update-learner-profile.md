# Badging Update Learner Profile Page
Page to display relevant fields in the learner profile that needs updating. Uses the learner's name and email address in query params to identify the learner. 

## Hide from menu (in Page Settings -> Page Info)
True

## Page URL Slug (in Page Settings -> SEO -> Search (Google)
badging-update-learner-profile

## Let Search Engines Index This Page (in Page Settings -> SEO)
False (off)

## Required Elements
Name:
> Badging Update Learner Profile

| Type                 | Name                         | Parent Element                | Attributes                                        |
|----------------------|------------------------------|-------------------------------|--------------------------------|
| Text                 | title                        | Root/Any                      | Text: "WELCOME", Hidden: false, Collapsed: false |
| ContainerBox         | dbDataContainerBox           | Root/Any                      | Hidden: true, Collapsed: true |
| Text                 | prompt                       | dbDataContainerBox            | Text: "Please complete the following account information.", Hidden: false, Collapsed: false |
| ContainerBox         | regionContainerBox           | dbDataContainerBox            | Hidden: true, Collapsed: true |
| Text                 | supportedRegionsPrompt       | regionContainerBox            | Text: "Which regions of the island you can provide support for (click to de-select):", Hidden: true, Collapsed: false |
| Table                | regionsTable                 | regionContainerBox            | Columns: ("Supported:supported, "Region":region), Clicking selects: Rows, Resize Table Height: Automatically, Show Header Row: off,
| ContainerBox         | eulaContainerBox             | dbDataContainerBox            | Hidden: true, Collapsed: true |
| Text                 | eulaTitle                    | eulaContainerBox              | Text: "Learner Agreement", Hidden: true, Collapsed: false |
| ContainerBox         | eulaBox                      | eulaContainerBox              | Hidden: true, Collapsed: false |
| Text                 | eulaText                     | eulaBox                       | Text: "", Hidden: true, Collapsed: false |
| Checkbox             | eulaAcceptedCheckbox         | eulaContainerBox              | Text: "I agree to the terms of the Learner agreement", Hidden: true, Collapsed: false. Enabled: true |
| ContainerBox         | captchaAndSubmitContainerBox | dbDataContainerBox            | Hidden: false, Collapsed: false |
| reCAPTCHA            | captcha                      | captchaAndSubmitContainerBox  | Hidden: true, Collapsed: false       |
| Button               | submitBtn                    | captchaAndSubmitContainerBox  | Text: "Submit", Hidden: true, Collapsed: false, Enabled: false |
