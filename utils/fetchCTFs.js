import axios from 'axios';

export async function fetchUpcomingCTFs(limit = 5) {
  try {
    const res = await axios.get(`https://ctftime.org/api/v1/events/?limit=${limit}`);
    return res.data.map(e => ({
      title: e.title,
      start: e.start.slice(0, 10),
      format: e.format,
      url: e.ctftime_url
    }));
  } catch (error) {
    throw new Error('Failed to fetch CTFs from CTFtime.');
  }
}