# Badge List Page
Page to display a list of all badges.

## Hide from menu (in Page Settings -> Page Info)
True

## Page URL Slug (in Page Settings -> SEO -> Search (Google)
badging-badge-list

## Required Elements
| Type                 | Name                   | Parent Element    | Attributes                                        |
|----------------------|------------------------|-------------------|--------------------------------|
| Text                 | statusText             | Root/Any          | Text: "No Badges Found.", Hidden: true, Collapsed: false |
| Text                 | loadingAnimationText   | Root/Any          | Text: "Loading Badges.", Hidden: false, Collapsed: false |
| Repeater             | badgesRepeater         | Root/Any          | Hidden: true, Collapsed: false |
| Container            | badgeContainer         | badgesRepeater    | Hidden: false, Collapsed: false |
| Text                 | name                   | badgeContainer    | Text: "Name", Hidden: false, Collapsed: false |
| Text                 | description            | badgeContainer    | Text: "Supported Regions", Hidden: false, Collapsed: false |
| Image                | badgeImg               | badgeContainer    | Hidden: false, Collapsed: false |
