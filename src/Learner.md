# Learner Page (CURRENTLY HIDDEN/UNUSED IN PRODUCTION)
Page to display learner-specific information:
+ Name
+ Region
+ Contact button
+ Portfolio link button
+ Awarded badges

## Required Elements
| Type                 | Name                   | Parent Element    | Attributes                                        |
|----------------------|------------------------|-------------------|--------------------------------|
| Text                 | name                   | Root/Any          | Text: "Name", Hidden: false, Collapsed: false                   |
| Text                 | region                 | Root/Any          | Text: "Region", Hidden: false, Collapsed: false                   |
| Button               | contactBtn             | Root/Any          | Text: "Contact", Hidden: false, Collapsed: false, Enabled: true    |
| Button               | portfolioBtn           | Root/Any          | Text: "Portfolio", Hidden: false, Collapsed: false, Enabled: true    |
| Text                 | noBadgesText           | Root/Any          | Text: "This learner has yet to earn any badges.", Hidden: true, Collapsed: false |
| Repeater             | badgeRepeater          | Root/Any          | Hidden: true, Collapsed: false |
| Container            | badgeContainer         | badgeRepeater     | Hidden: false, Collapsed: false |
| Image                | badgeImg               | badgeContainer    | Hidden: false, Collapsed: false |
| Text                 | badgeName              | badgeContainer    | Text: "Badge Title", Hidden: false, Collapsed: false |
| Text                 | shortDescription       | badgeContainer    | Text: "Short Description", Hidden: false, Collapsed: false |
| Button               | readMoreBtn            | badgeContainer    | Text: "Read Mode", Hidden: false, Collapsed: false |
