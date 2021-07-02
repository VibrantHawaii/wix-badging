# SearchResults Page
Page to display search results form a query for learners in a region for specific (or all) badges. Displays a list of learners.

## Required Elements
| Type                 | Name                   | Parent Element    | Attributes                                        |
|----------------------|------------------------|-------------------|--------------------------------|
| Text                 | statusText             | Root/Any          | Text: "No Learners found", Hidden: true, Collapsed: false |
| Repeater             | learnersRepeater       | Root/Any          | Hidden: true, Collapsed: false |
| Container            | learnerContainer       | learnersRepeater  | Hidden: false, Collapsed: false |
| Text                 | name                   | learnerContainer  | Text: "Name", Hidden: false, Collapsed: false |
| Text                 | region                 | learnerContainer  | Text: "Region", Hidden: false, Collapsed: false |
| Table                | badgesTable            | learnerContainer  | Hidden: true, Collapsed: false |
| Image                | badgeImg               | badgesTable       | Field: badgeImg, Column |
| String               | badgeTitle             | badgesTable       | Field: badgeTitle, Column |
