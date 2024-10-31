class DiscordMessageBuilder {
  constructor() {
    this.content = "";
    this.items = [];
  }

  addMentionsByRole(roleName) {
    const role = ROLES[roleName];
    if (!role) {
      console.warn(`Role ${roleName} not found`);
      return;
    }

    this.content += `<@&${role.headRoleId}> <@&${role.depHeadRoleId}>`;
  }

  addField(question, answer) {
    if (!answer) return;

    try {
      const parts = typeof answer === 'string' ? 
        answer.match(/[\s\S]{1,1024}/g) || [] : 
        [answer.toString()];

      parts.forEach((part, index) => {
        this.items.push({
          name: index === 0 ? question : `${question} (cont.)`,
          value: part,
          inline: false
        });
      });
    } catch (error) {
      console.error(`Error processing field ${question}:`, error);
      this.items.push({
        name: question,
        value: "Error processing response",
        inline: false
      });
    }
  }

  buildPayload() {
    return {
      content: this.content,
      embeds: [{
        title: CONFIG.discord.embed.title,
        color: CONFIG.discord.embed.color,
        fields: this.items,
        url: CONFIG.discord.embed.url,
        image: {
          url: CONFIG.discord.embed.imageUrl,
        },
        footer: {
          text: CONFIG.discord.embed.footerText
        },
        timestamp: new Date().toISOString()
      }]
    };
  }
}