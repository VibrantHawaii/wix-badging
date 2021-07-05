# Badging Contact Popup Lightroom
Lightroom popup to enable entering data to send to a Learner when Contact is selected

## Required Elements
Name:
> Badging Contact Popup

| Type                 | Name                       | Parent Element    | Attributes                                        |
|----------------------|----------------------------|-------------------|--------------------------------|
| Text                 | contactPopupTitle          | Lightbox          | Text: "Contact", Hidden: false, Collapsed: false |
| Text                 | contactPopupStatus         | Lightbox          | Text: "Status", Hidden: true, Collapsed: false |
| Button               | closeBtn                   | Lightbox          | Text: "X", Hidden: false, Collapsed: false |
| Button               | contactPopupSendBtn        | Lightbox          | Text: "Send", Hidden: false, Collapsed: false |
| Input                | contactPopupNameInput      | Lightbox          | Text: "Add your Name", Hidden: false, Collapsed: false, Enabled: true |
| Input                | contactPopupEmailInput     | Lightbox          | Text: "Add your Email Address", Hidden: false, Collapsed: false, Enabled: true |
| Input                | contactPopupMessageInput   | Lightbox          | Text: "Type your message here", Hidden: false, Collapsed: false, Enabled: true |
