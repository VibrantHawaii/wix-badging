# Badging Admin View Current EULA Popup Lightroom
Lightroom popup to view the current (latest saved) User Agreement

## Required Elements
Name:
> Badging Admin View Current EULA Popup

| Type                 | Name                       | Parent Element    | Attributes                                        |
|----------------------|----------------------------|-------------------|--------------------------------|
| ContainerBox         | box1                       | Lightbox          | Hidden: false, Collapsed: false |
| Text                 | title                      | box1              | Text: "CREATE/EDIT USER AGREEMENT", Hidden: false, Collapsed: false |
| Text                 | prompt                     | box1              | Text: "Previous User Agreement text as of: ", Hidden: false, Collapsed: false |
| Rich Text Box        | EulaRichTextBox            | box1              | Text: (Placeholder) "Enter User Agreement here", Hidden: false, Collapsed: false |
| Button               | closeBtn                   | box1              | Text: "X", Hidden: false, Collapsed: false |
| Button               | saveBtn                    | box1              | Text: "Save", Hidden: true, Collapsed: false, Enabled: false |
| Text                 | status                     | box1              | Text: "Status", Hidden: true, Collapsed: false |
