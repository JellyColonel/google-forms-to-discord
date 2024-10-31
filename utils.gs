class DiscordMessageBuilder {
  constructor() {
    this.content = "";
    this.items = [];
    this.selectedRole = null;
  }

  addMentionsByRole(roleName) {
    const role = ROLES[roleName];
    if (!role) {
      console.warn(`Role ${roleName} not found`);
      return;
    }

    this.selectedRole = role;
    this.content += `<@&${role.depHeadRoleId}> <@&${role.headRoleId}>`;
  }

  addField(question, answer) {
    if (!answer) return;

    try {
      const parts =
        typeof answer === "string"
          ? answer.match(/[\s\S]{1,1024}/g) || []
          : [answer.toString()];

      parts.forEach((part, index) => {
        this.items.push({
          name: index === 0 ? question : `${question} (continued)`,
          value: part,
          inline: false,
        });
      });
    } catch (error) {
      console.error(`Error processing field ${question}:`, error);
      this.items.push({
        name: question,
        value: "Error processing response",
        inline: false,
      });
    }
  }

  getEmbedColor() {
    // If role colors are enabled and a role is selected, use role color
    if (
      CONFIG.discord.embed.color.useRoleColors &&
      this.selectedRole?.embedColor
    ) {
      return ColorUtils.hexToDecimal(this.selectedRole.embedColor);
    }
    // Otherwise use default color
    return ColorUtils.hexToDecimal(CONFIG.discord.embed.color.defaultColor);
  }

  buildPayload() {
    const embed = {
      title: CONFIG.discord.embed.title,
      color: this.getEmbedColor(),
      fields: this.items,
      url: CONFIG.discord.embed.url,
      image: {
        url: CONFIG.discord.embed.imageUrl,
      },
      footer: {
        text: CONFIG.discord.embed.footerText,
      },
    };

    // Add timestamp only if showTimestamp is true
    if (CONFIG.discord.embed.showTimestamp) {
      embed.timestamp = new Date().toISOString();
    }

    return {
      content: this.content.trim(),
      username: CONFIG.discord.username,
      avatar_url: CONFIG.discord.avatarUrl,
      embeds: [embed],
    };
  }
}
