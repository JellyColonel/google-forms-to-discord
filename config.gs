function initializeConfig() {
  const activeForm = FormApp.getActiveForm();
  const formUrl = activeForm.getPublishedUrl();

  return {
    discord: {
      webhookUrl:
        "https://discord.com/api/webhooks/1310978770051530802/gF1Cdi5r-kRR8l6ESXvmYNgk8ljRh3gLa2vKgTsQXAh3VZA7FLLmFyY6z8mf8Q_EgukH",
      username: "",
      avatarUrl: "",
      embed: {
        title: "Электронное заявление на перевод в EMS Boston",
        color: {
          useRoleColors: true,
          defaultColor: "#7289DA",
        },
        url: formUrl,
        imageUrl:
          "https://media.discordapp.net/attachments/1169635493114298499/1183127019865772072/xosiYkMPMTg.jpg?ex=660866e6&is=65f5f1e6&hm=f0905625850e1ab8d2c5c00cad9143f7d2aaa5d7625339a9125991f4ff7e45d0&format=webp&width=1440&height=362&",
        footerText: "by Brian(ds: jellycolonel)",
        footerIcon:
          "https://cdn.discordapp.com/emojis/1230130771990282250.webp?size=96&quality=lossless",
        showTimestamp: true,
      },
      content: {
        mode: "static",
        staticText: "<@&1274111070457430099> <@&1274111070457430098>",
        includeMentions: {
          curator: true,
          head: true,
          depHead: true,
        },
      },
    },
    form: {
      multipleChoiceQuestionName: "Ваш отдел:",
      discordIdIdentifier: "Ваш Discord",
    },
  };
}

// Create a global CONFIG object
const CONFIG = initializeConfig();

// Optional: Function to validate config
function validateConfig() {
  const configErrors = [];

  if (!CONFIG.discord.embed.url) {
    configErrors.push("Form URL is not set");
  }

  if (!CONFIG.discord.webhookUrl) {
    configErrors.push("Discord webhook URL is not set");
  }

  // Add content mode validation
  if (!["static", "dynamic"].includes(CONFIG.discord.content.mode)) {
    configErrors.push("Invalid content mode. Must be 'static' or 'dynamic'");
  }

  // Validate static text is present when in static mode
  if (
    CONFIG.discord.content.mode === "static" &&
    !CONFIG.discord.content.staticText
  ) {
    configErrors.push("Static text must be provided when using static mode");
  }

  // Validate mention settings structure when in dynamic mode
  if (CONFIG.discord.content.mode === "dynamic") {
    const requiredSettings = ["curator", "head", "depHead"];
    const { includeMentions } = CONFIG.discord.content;

    requiredSettings.forEach((setting) => {
      if (typeof includeMentions[setting] !== "boolean") {
        configErrors.push(
          `Missing or invalid ${setting} setting in includeMentions`
        );
      }
    });
  }

  if (configErrors.length > 0) {
    throw new Error(`Configuration errors found:\n${configErrors.join("\n")}`);
  }

  return true;
}
