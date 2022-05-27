# Badging Admin Add A Badge Popup Lightroom
Lightroom popup to enable to add a new badge

## Required Elements
Name:
> Badging Admin Add A Badge Popup

| Type                 | Name                           | Parent Element    | Attributes                                        |
|----------------------|--------------------------------|-------------------|--------------------------------|
| ContainerBox         | box1                           | Lightbox          | Hidden: false, Collapsed: false |
| Text                 | title                          | Lightbox          | Text: "ADD A BADGE", Hidden: false, Collapsed: false |
| Button               | closeBtn                       | Lightbox          | Text: "X", Hidden: false, Collapsed: false |
| Input                | badgeNameInput                 | Lightbox          | Required: true, Text: "Badge Name", Hidden: false, Collapsed: false, Enabled: true |
| Text                 | categoryPrompt                 | Lightbox          | Text: "Category:", Hidden: false, Collapsed: false |
| Dropdown             | categoryDropdown               | Lightbox          | Required: true, Hidden: false, Collapsed: false, Enabled: true    |
| Image                | badgeIconImage                 | Lightbox          | Image: "Anything", Hidden: true, Collapsed: false |
| Upload Button        | uploadFileBtn                  | Lightbox          | Text: "Upload Badge Icon Image File", Hidden: false, Collapsed: false |
| Dataset              | badgeIconDataset               | Lightbox          | Collection: Badging-BadgeIcons, Dataset Name: "Badging-BadgeIcons dataset", Mode: R&W
| ContainerBox         | enrollmentUrlBox               | Lightbox          | Hidden: false, Collapsed: false |
| Check Box            | onTeachableCheckbox            | Lightbox          | Test: "Course is on Teachable", Hidden: false, Collapsed: false, Enabled: true |
| Input                | enrollmentUrlInput             | enrollmentUrlBox  | Required: false, Text: '(Optional) Enrollment URL including "http://"', Hidden: false, Collapsed: false, Enabled: true, Settings->Type: Email |
| ContainerBox         | teachableIdBox                 | Lightbox          | Hidden: true, Collapsed: true |
| Text                 | teachableCourseIdPrompt        | teachableIdBox    | Text: "Teachable Course ID (Teachable->Admin->Course->Information)::", Hidden: false, Collapsed: false |
| Image                | teachableCourseIdImg           | teachableIdBox    | Image: "Teachable Course ID.png", Hidden: false, Collapsed: false |
| Input                | teachableCourseIdInput         | teachableIdBox    | Required: false, Text: "Email Address", Hidden: false, Collapsed: false, Enabled: true, Settings->Type: Email |
| Check Box            | expiresCheckbox                | Lightbox          | Test: "Badge expires", Hidden: false, Collapsed: false, Enabled: true |
| Text                 | expiresMonthsPrompt            | Lightbox          | Text: "Months:", Hidden: true, Collapsed: false |
| Dropdown             | expiryMonthsDropdown           | Lightbox          | Placeholder Text: Select Expiry Duration after Issuance, Hidden: true, Collapsed: false, Enabled: true    |
| Text                 | shortDescriptionPrompt         | Lightbox          | Text: "Short Description (256 characters maximum):", Hidden: true, Collapsed: false |
| Input                | shortDescriptionInput          | Lightbox          | Required: true, Text: (Placeholder) "Enter the short description here. This is shown in the badge list page.", Hidden: false, Collapsed: false |
| Text                 | detailedDescriptionPrompt      | Lightbox          | Text: "Detailed Description:", Hidden: true, Collapsed: false |
| Rich Text Box        | detailedDescriptionRichTextBox | Lightbox          | Required: true, Text: (Placeholder) "Enter the detailed descripton here. This is shown in the badge details page.", Hidden: false, Collapsed: false |
| Button               | submitBtn                      | Lightbox          | Connected to Data: (Dataset: Badging-BadgeIcons dataset, Click action: Submit, Stay on this page, Label not connected), Text: "Submit", Hidden: true, Collapsed: false, Enabled: false |
| Text                 | status                         | Lightbox          | Text: "Status", Hidden: true, Collapsed: false |
