const CHANNELS = [
  { name: 'web', emoji: '🌐' },
  { name: 'crypto', emoji: '🔐' },
  { name: 'forensics', emoji: '🔍' },
  { name: 'networking', emoji: '📡' },
  { name: 'pwn', emoji: '💻' },
  { name: 'rev', emoji: '🔧' },
  { name: 'misc', emoji: '🎲' },
  { name: 'osint', emoji: '🕵️' },
  { name: 'apk', emoji: '📱' },
  { name: 'ai', emoji: '🤖' }
];

export default {
  data: { name: 'create_category' },
  async execute(message, args) {
    if (!message.member.permissions.has('ManageChannels')) {
      return message.reply('❌ You need **Manage Channels** permission to use this command.');
    }

    if (args.length === 0) {
      return message.reply('ℹ️ Usage: `!createcategory <Category Name>`');
    }

    const categoryName = args.join(' ').toUpperCase();

    try {
      const category = await message.guild.channels.create({
        name: categoryName,
        type: 4, // Category
      });

      const channelPromises = CHANNELS.map(ch =>
        message.guild.channels.create({
          name: `${ch.emoji}-${ch.name}`,
          type: 0, // Text channel
          parent: category.id,
        })
      );

      await Promise.all(channelPromises);

      await message.reply(`✅ Created category **${categoryName}** with ${CHANNELS.length} challenge channels!`);
    } catch (error) {
      console.error('Error creating category:', error);
      await message.reply('❌ Failed to create category. Check bot permissions.');
    }
  }
};