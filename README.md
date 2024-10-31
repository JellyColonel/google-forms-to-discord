# Google Forms to Discord Webhook

*Read this in other languages: [English](README.md), [Русский](README.ru.md)*

This Google Apps Script automatically forwards Google Form submissions to a Discord channel using webhooks. It formats the submissions into neat embeds and can mention specific roles based on form responses, with support for customizable embed colors.

## Features

- 📝 Automatically processes Google Form submissions
- 📨 Sends formatted embeds to Discord
- 👥 Mentions relevant roles based on department selection
- 🎨 Supports both role-specific and common embed colors
- 🔄 Automatic color format conversion (HEX to Discord decimal)
- 🆔 Formats Discord IDs into proper mentions
- ↔️ Handles long responses by splitting them into multiple fields
- ⚠️ Includes error handling and logging

## Setup

### 1. Discord Setup

1. In your Discord server, go to Server Settings > Integrations > Webhooks
2. Create a new webhook or use an existing one
3. Copy the webhook URL
4. Update the `webhookUrl` in `config.gs`

### 2. Google Forms Setup

1. Create a new Google Form or open an existing one
2. Go to Script editor (Extensions > Apps Script)
3. Create the following files and copy the respective code:
   - `config.gs`
   - `roles.gs`
   - `colors.gs`
   - `utils.gs`
   - `main.gs`
4. Save all files

### 3. Configuration

#### Basic Configuration
Update the following configurations in `config.gs`:

```javascript
const CONFIG = {
  discord: {
    webhookUrl: "YOUR_WEBHOOK_URL",
    embed: {
      title: "Your Form Title",
      color: {
        useRoleColors: true,  // Toggle between role-specific colors or common color
        defaultColor: "#7289DA"  // Default/common color in HEX format
      },
      url: "https://your-form-url.com",
      imageUrl: "", // Optional image URL
      footerText: "Your Footer Text"
    }
  },
  form: {
    multipleChoiceQuestionName: "Your Department Question",
    discordIdIdentifier: "discord id"
  }
};
```

#### Role Configuration
Update role IDs and colors in `roles.gs` according to your Discord server roles:

```javascript
const ROLES = {
  DEPARTMENT_NAME: {
    roleName: "Department Name",
    roleId: "role_id",
    curatorRoleId: "curator_role_id",
    headRoleId: "head_role_id",
    depHeadRoleId: "dep_head_role_id",
    embedColor: "#HEX_COLOR"  // Role-specific embed color
  },
  // Add more departments as needed
};
```

### 4. Color Configuration

#### Color Modes
The script supports two color modes:
1. **Role-specific Colors**: Each department/role can have its own embed color
2. **Common Color**: All embeds use the same color

To switch between modes, update the `useRoleColors` flag in `config.gs`:
```javascript
color: {
  useRoleColors: true,  // true for role-specific colors, false for common color
  defaultColor: "#7289DA"  // Used when useRoleColors is false or no role selected
}
```

#### Using the Color Utilities
The script includes color utility functions in `colors.gs`:

```javascript
// Convert HEX to Discord decimal color
const decimalColor = ColorUtils.hexToDecimal('#FF0000');
```

## Usage

The script automatically triggers when a form is submitted. Each submission will:

1. Create a Discord embed with the form responses
2. Format any Discord IDs as mentions
3. Mention relevant department roles based on the department selection
4. Apply appropriate color based on the color mode setting
5. Handle long responses by splitting them into multiple fields
6. Include a timestamp and footer

## Example Discord Output

```
@DepartmentHead @DepartmentDeputy

Embed Title: Your Form Title
Fields:
- Question 1: Answer 1
- Question 2: Answer 2
- Discord ID: @user
- Department: Department Name
Footer: Your Footer Text
Timestamp: [Current Time]
```

## Error Handling

The script includes error handling for:
- Invalid responses
- Discord webhook failures
- Message formatting issues
- Role mention errors

All errors are logged to the Apps Script console for debugging.

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Create a pull request

## License

MIT License - feel free to use and modify as needed.

## Credits

Created and maintained by JellyColonel

## Support

For issues and feature requests, please create an issue in the GitHub repository.