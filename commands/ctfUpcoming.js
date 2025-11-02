import { fetchUpcomingCTFs } from '../utils/fetchCTFs.js';

export default {
  data: { name: 'ctf_upcoming' },
  async execute(message) {
    try {
      const events = await fetchUpcomingCTFs(5);
      const eventList = events
        .map(e => `🧩 [**${e.title}**](<${e.url}>) - ${e.start} (${e.format})`)
        .join('\n') || 'No upcoming CTFs found.';

      await message.channel.send(`📅 **Upcoming CTFs:**\n${eventList}`);
    } catch (error) {
      console.error(error);
      await message.channel.send('⚠️ Could not fetch upcoming CTFs.');
    }
  }
};