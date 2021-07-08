# SearchResults Page
Page to display search results form a query for learners in a region for specific (or all) badges. Displays a list of learners.

## Page URL Slug (in Page Settings -> SEO -> Search (Google)
badging-search-results

## Required Elements
| Type                 | Name                   | Parent Element    | Attributes                                        |
|----------------------|------------------------|-------------------|--------------------------------|
| Text                 | statusText             | Root/Any          | Text: "No Learners Found.", Hidden: true, Collapsed: false |
| Text                 | loadingAnimationText   | Root/Any          | Text: "Searching the island.", Hidden: false, Collapsed: false |
| Repeater             | learnersRepeater       | Root/Any          | Hidden: true, Collapsed: false |
| Container            | learnerContainer       | learnersRepeater  | Hidden: false, Collapsed: false |
| Text                 | name                   | learnerContainer  | Text: "Name", Hidden: false, Collapsed: false |
| Text                 | homeRegion             | learnerContainer  | Text: "Home Region", Hidden: false, Collapsed: false |
| Text                 | supportedRegions       | learnerContainer  | Text: "Supported Regions", Hidden: false, Collapsed: false |
| Table                | badgesTable            | learnerContainer  | Hidden: true, Collapsed: false |
| Image                | badgeImg               | badgesTable       | Field: badgeImg, Column |
| String               | badgeTitle             | badgesTable       | Field: badgeTitle, Column |
