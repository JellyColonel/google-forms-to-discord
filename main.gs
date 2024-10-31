function onSubmit(e) {
  try {
    const messageBuilder = new DiscordMessageBuilder();
    const formResponses = e.response.getItemResponses();
    
    // Process form responses
    formResponses.forEach(responseAnswer => {
      const question = responseAnswer.getItem().getTitle();
      let answer = responseAnswer.getResponse();

      // Handle Discord ID formatting
      if (question.toLowerCase().includes(CONFIG.form.discordIdIdentifier)) {
        answer = `<@${answer}>`;
      }

      // Handle department selection and role mentions
      if (question.includes(CONFIG.form.multipleChoiceQuestionName)) {
        messageBuilder.addMentionsByRole(answer);
      }

      messageBuilder.addField(question, answer);
    });

    // Send to Discord
    const payload = messageBuilder.buildPayload();
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      muteHttpExceptions: true,
      payload: JSON.stringify(payload)
    };

    const webhookResponse = UrlFetchApp.fetch(CONFIG.discord.webhookUrl, options);
    
    if (webhookResponse.getResponseCode() !== 200) {
      console.error('Discord webhook failed:', webhookResponse.getContentText());
      throw new Error('Failed to send message to Discord');
    }

  } catch (error) {
    console.error('Error in onSubmit:', error);
  }
}