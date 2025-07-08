# User Information Variables

These global variables provide information about the current user, their preferences, settings, and account details.

## Basic User Information

| Variable | Type | Description |
| --- | --- | --- |
| `username` | String | The username of the current user |
| `user_icon` | String | URL to the user's profile picture |
| `user_folder` | String | Path to the user's home folder |
| `global_accent` | String | The user's selected accent color in hex format |

## User Object

The `user` object contains comprehensive information about the current user, including personal details, preferences, and system settings.

### Personal Information

| Property | Type | Description |
| --- | --- | --- |
| `user.username` | String | The username of the current user |
| `user.pfp` | String | URL to the user's profile picture |
| `user.banner` | String | URL to the user's profile banner |
| `user.bio` | String | The user's biography |
| `user.pronouns` | String | The user's preferred pronouns |
| `user.birthday` | String | The user's birthday |
| `user.created` | Number | Timestamp when the user account was created |
| `user.last_login` | Number | Timestamp of the user's last login |
| `user.discord_id` | Number | Represents the user's linked Discord account id |
| `user.private` | Boolean | Whether the user's profile information is publicly accessible. |

### User Preferences

| Property | Type | Description |
| --- | --- | --- |
| `user.theme` | Object | User's theme preferences |
| `user.theme.accent` | String | Accent color in hex format |
| `user.theme.background` | String | Background color in hex format |
| `user.theme.primary` | String | Primary color in hex format |
| `user.theme.secondary` | String | Secondary color in hex format |
| `user.theme.tertiary` | String | Tertiary color in hex format |
| `user.theme.text` | String | Text color in hex format |
| `user.wallpaper` | String | URL to the user's wallpaper image |
| `user.wallpaper_mode` | String | How the wallpaper is displayed (e.g., "Fill") |
| `user.scrollspeed` | Number | User's preferred scroll speed |
| `user.proxy` | String | The CORS proxy OriginOS will default to for the user |

### System Information

| Property | Type | Description |
| --- | --- | --- |
| `user.timezone` | String | User's timezone |
| `user.system` | String | User's system name |
| `user.hostOS` | String | User's host operating system |
| `user.max_size` | String | Maximum storage size allocated to the user |
| `user.used_size` | Number | Amount of storage currently used by the user |
| `user.onboot` | Array | List of applications to launch on system boot |
| `user.origin_dock` | Array | List of dock modules to load |

### User's System Data

| Property | Type | Description |
| --- | --- | --- |
| `user["sys.badges"]` | Array | Badges earned by the user |
| `user["sys.banners"]` | Array | Banner images available to the user |
| `user["sys.currency"]` | Number | User's virtual currency amount |
| `user["sys.friends"]` | Array | List of the user's friends |
| `user["sys.requests"]` | Array | List of the user's pending friend requests |
| `user["sys.items"]` | Array | Items owned by the user |
| `user["sys.purchases"]` | Array | Items purchased by the user |
| `user["sys.transactions"]` | Array | History of currency transactions |
| `user["sys.aura"]` | Number | An arbitrary statistic which is built by being online on OriginOS; closing the tab resets this to 0 |
| `user["sys.roturbotMem"]` | Object | A list of AI-generated keys referenced by RoturBot, an AI Discord bot |

## Examples

```javascript
// Basic user greeting.
log "Hello, " + username + "!"

// Working with user theme colors.
background = user.theme.background
text_color = user.theme.text

// Check if user has any pending friend requests.
requests = user["sys.requests"]
if 0 < requests.len (
  log "You have" + requests.len + "pending friend requests!"
)

// Display the friends a user has.
log "Your friends:"
each friend user["sys.friends"] (
  log "- " + friend
)
```