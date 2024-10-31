# Google Forms to Discord Webhook

_Read this in other languages: [English](README.en.md), [Русский](README.md)_

This Google Apps Script automatically forwards Google Form submissions to a Discord channel using webhooks. It formats the submissions into neat embeds and can mention specific roles based on form responses, with support for customizable embed colors, webhook appearance, and timestamps.

## Features

Core Features:
- 📝 Automatically processes Google Form submissions
- 📨 Sends formatted embeds to Discord
- 👥 Mentions relevant roles based on department selection

Message Formatting:
- ↔️ Handles long responses by splitting them into multiple fields
- 🆔 Formats Discord IDs into proper mentions
- ⏰ Optional timestamp display in embeds
- 🤖 Customizable webhook bot username and avatar
- 📋 Customizable form field headers and descriptions

Visual Customization:
- 🎨 Supports both role-specific and common embed colors
- 🔄 Automatic color format conversion (HEX to Discord decimal)
- 🖼️ Support for images in embeds
- 👣 Customizable footer text

Technical Capabilities:
- 🔗 Auto-configures form URL
- ⚙️ Validates configuration on startup
- ⚠️ Includes error handling and logging
- 🔒 Built-in Discord ID validation using regex
- 🔄 Automatic synchronization of department choices with configuration

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

The script now automatically retrieves your form's URL. Update the following configurations in `config.gs`:

```javascript
const CONFIG = initializeConfig();

function initializeConfig() {
  const activeForm = FormApp.getActiveForm();
  const formUrl = activeForm.getPublishedUrl();

  return {
    discord: {
      webhookUrl: "YOUR_WEBHOOK_URL",        // Your Discord webhook URL
      username: "Your Bot Name",             // Custom name for the webhook bot
      avatarUrl: "",                         // Optional: URL for the webhook bot's avatar
      embed: {
        title: "Your Form Title",            // Title displayed at the top of Discord embed
        color: {
          useRoleColors: true,               // Set to true to use department-specific colors, false for common color
          defaultColor: "#7289DA",           // Default/common color in HEX format
        },
        url: formUrl,                        // Automatically set to your form's URL
        imageUrl: "",                        // Optional: URL for an image to include in embeds
        footerText: "Your Footer Text",      // Text displayed at the bottom of Discord embed
        showTimestamp: true,                 // Set to true to show timestamp in embeds
      },
      content: {
        mode: "dynamic",                     // Can be "static" or "dynamic". Static uses fixed text, dynamic uses mentions
        staticText: "",                      // Fixed text to use when mode is "static"
        includeMentions: {                   // Configure which roles to mention in dynamic mode
          depHead: true,                     // Whether to include department head mentions
          head: true,                        // Whether to include head mentions
          curator: false                     // Whether to include curator mentions
        }
      }
    },
    form: {
      title: "Form Title",                   // Title of your Google Form
      description: "Form Description",        // Description text for your Google Form
      multipleChoiceQuestionName: "Department Selection", // Question title used to determine which roles to mention
      discordIdIdentifier: "Discord ID",     // Question title containing Discord ID to be formatted as mention
    },
  };
}
```

#### Content Configuration

The script supports two modes for message content:

1. **Dynamic Mode**: Automatically mentions relevant roles based on the department selection
   ```javascript
   content: {
     mode: "dynamic",
     staticText: "",
     includeMentions: {
       depHead: true,  // Include department head mentions
       head: true,     // Include head mentions
       curator: false  // Include curator mentions
     }
   }
   ```

2. **Static Mode**: Uses fixed text instead of role mentions
   ```javascript
   content: {
     mode: "static",
     staticText: "New application submitted!",
     includeMentions: {} // Ignored in static mode
   }
   ```

You can configure:
- Which mode to use ("static" or "dynamic")
- Static text to display (when in static mode)
- Which types of roles to mention (when in dynamic mode)

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
    embedColor: "#HEX_COLOR", // Role-specific embed color
  },
  // Add more departments as needed
};
```

### 4. Form Setup and Validation

1. In the Apps Script editor, create a new file named `form-setup.gs`
2. Copy the provided setup code into the file
3. Run the `setupForm()` function to configure your form:
   - Set up Discord ID validation (regex pattern: `^\d{17,19}$`)
   - Configure department choices based on ROLES
   - Set form title and description

To update form validation later:
- Run `setupFormValidation()` to update just the validation rules
- Run `resetFormValidation()` if you need to remove all validations
- Run `setupForm()` to perform a complete form setup

Note: Remember to run these setup functions again if you:
- Make changes to the ROLES configuration
- Modify the form structure
- Need to update validation rules

### 5. Color Configuration

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
const decimalColor = ColorUtils.hexToDecimal("#FF0000");
```

### 6. Trigger Setup

1. In the Apps Script editor, click on "Triggers" (clock icon in the sidebar)
2. Click "+ Add Trigger"
3. Configure the trigger:
   - Choose function: `onSubmit`
   - Select event source: "From form"
   - Select event type: "On form submit"
4. Click "Save"
5. Authorize the script when prompted

## Usage

The script automatically triggers when a form is submitted. Each submission will:

1. Create a Discord embed with the form responses
2. Format any Discord IDs as mentions
3. Mention relevant department roles based on the department selection
4. Apply appropriate color based on the color mode setting
5. Handle long responses by splitting them into multiple fields
6. Include a timestamp and footer

## Example Discord Output

![](./FormsToDiscordExample.png)

## Error Handling

The script includes error handling for:

- Invalid responses
- Discord webhook failures
- Message formatting issues
- Role mention errors
- Configuration validation
- Form URL retrieval issues

All errors are logged to the Apps Script console for debugging.

## Troubleshooting

If messages aren't being sent:

1. Check the Apps Script execution logs for detailed error messages
2. Verify the webhook URL is correct and the webhook hasn't been deleted
3. Ensure the trigger is properly set up and authorized
4. Confirm that form question titles match your configuration
5. Check that role IDs are correct and the roles still exist in your server

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Create a pull request

## License

MIT License - feel free to use and modify as needed.

## Credits

Created and maintained by JellyColonel (Discord: jellycolonel)

## Support

For issues and feature requests, please create an issue in the GitHub repository.
