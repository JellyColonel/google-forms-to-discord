function initializeConfig() {
  const activeForm = FormApp.getActiveForm();
  const formUrl = activeForm.getPublishedUrl();

  return {
    discord: {
      webhookUrl: "ВАШ_URL_ВЕБХУКА",
      username: "Имя бота",
      avatarUrl: "",
      embed: {
        title: "Название Вашей Формы",
        color: {
          useRoleColors: true,
          defaultColor: "#7289DA",
        },
        url: formUrl,
        imageUrl: "",
        footerText: "Текст нижнего колонтитула",
        showTimestamp: true,
      },
    },
    form: {
      title: "Название формы",
      description: "Описание формы"
      multipleChoiceQuestionName: "Вопрос о Выборе Отдела",
      discordIdIdentifier: "Discord ID",
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
