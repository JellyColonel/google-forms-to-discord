function initializeConfig() {
  const activeForm = FormApp.getActiveForm();
  const formUrl = activeForm.getPublishedUrl();

  return {
    discord: {
      webhookUrl:
        "https://discord.com/api/webhooks/1301475407412985866/N56PL88eRjEvq9WXyfiQN-15e-tGsKJQrDQcgUm9eRaI98nGw_tRXWYCd91HrUmyxIbD",
      username: "",
      avatarUrl: "",
      embed: {
        title: "Недельный отчёт HR",
        color: {
          useRoleColors: true,
          defaultColor: "#7289DA",
        },
        url: formUrl,
        imageUrl:
          "https://media.discordapp.net/attachments/1169635493114298499/1183127019865772072/xosiYkMPMTg.jpg?ex=660866e6&is=65f5f1e6&hm=f0905625850e1ab8d2c5c00cad9143f7d2aaa5d7625339a9125991f4ff7e45d0&format=webp&width=1440&height=362&",
        footerText: "for EMS by Jordan(ds: k0klush)",
        footerIcon:
          "https://cdn.discordapp.com/emojis/1230130771990282250.webp?size=96&quality=lossless",
        showTimestamp: true,
      },
    },
    form: {
      title: "Название формы",
      description: "Описание формы",
      multipleChoiceQuestionName: "Ваш отдел:",
      discordIdIdentifier: "Отправил(а) форму:",
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

  if (configErrors.length > 0) {
    throw new Error(`Configuration errors found:\n${configErrors.join("\n")}`);
  }

  return true;
}
