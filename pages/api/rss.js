import axios from 'axios';

export default async (req, res) => {
  try {
    const response = await axios.get('https://feeds.bbci.co.uk/news/england/rss.xml');
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};
