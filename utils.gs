class DiscordMessageBuilder {
  constructor() {
    this.content = "";
    this.items = [];
    this.selectedRole = null;
    this.MAX_FIELDS_PER_EMBED = 25;
  }

  addMentionsByRole(roleName) {
    const role = ROLES[roleName];
    if (!role) {
      console.warn(`Role ${roleName} not found`);
      return;
    }

    this.selectedRole = role;
    this.content += `<@&${role.curatorRoleId}>`;
  }

  addField(question, answer) {
    if (!answer && answer !== 0) return;

    try {
      const value = String(answer).trim();
      if (!value) return;

      this.items.push({
        name: String(question).trim(),
        value: value,
        inline: false,
      });
    } catch (error) {
      console.error(`Error processing field ${question}:`, error);
    }
  }

  getEmbedColor() {
    try {
      if (
        CONFIG.discord.embed.color.useRoleColors &&
        this.selectedRole?.embedColor
      ) {
        return ColorUtils.hexToDecimal(this.selectedRole.embedColor) || 7506394;
      }
      return (
        ColorUtils.hexToDecimal(CONFIG.discord.embed.color.defaultColor) ||
        7506394
      );
    } catch (error) {
      console.error("Error processing color:", error);
      return 7506394;
    }
  }

  createFooter() {
    if (!CONFIG.discord.embed.footerText?.trim()) {
      return undefined;
    }

    const footer = {
      text: CONFIG.discord.embed.footerText.trim(),
    };

    if (CONFIG.discord.embed.footerIcon?.trim()) {
      footer.icon_url = CONFIG.discord.embed.footerIcon.trim();
    }

    return footer;
  }

  createEmbed(fields, isFirst, isLast) {
    const embed = {
      color: this.getEmbedColor(),
      fields: fields,
    };

    if (isFirst) {
      embed.title = CONFIG.discord.embed.title || "Form Submission";
      if (CONFIG.discord.embed.url) {
        embed.url = CONFIG.discord.embed.url;
      }
    }

    if (isLast) {
      const footer = this.createFooter();
      if (footer) {
        embed.footer = footer;
      }

      if (CONFIG.discord.embed.showTimestamp) {
        embed.timestamp = new Date().toISOString();
      }

      // Add image to the last embed if provided
      if (CONFIG.discord.embed.imageUrl?.trim()) {
        embed.image = {
          url: CONFIG.discord.embed.imageUrl.trim(),
        };
      }
    }

    return embed;
  }

  buildPayload() {
    // Split fields into chunks of 25
    const chunks = [];
    for (let i = 0; i < this.items.length; i += this.MAX_FIELDS_PER_EMBED) {
      chunks.push(this.items.slice(i, i + this.MAX_FIELDS_PER_EMBED));
    }

    // Create an embed for each chunk
    const embeds = chunks.map((chunk, index) => {
      const isFirst = index === 0;
      const isLast = index === chunks.length - 1;
      return this.createEmbed(chunk, isFirst, isLast);
    });

    // Build the final payload
    const payload = {
      embeds: embeds,
    };

    // Add content only if it's not empty
    if (this.content.trim()) {
      payload.content = this.content.trim();
    }

    // Add username only if it's provided and not empty
    if (CONFIG.discord.username?.trim()) {
      payload.username = CONFIG.discord.username.trim();
    }

    // Add avatar URL only if it's provided and not empty
    if (CONFIG.discord.avatarUrl?.trim()) {
      payload.avatar_url = CONFIG.discord.avatarUrl.trim();
    }
    return payload;
  }
}
