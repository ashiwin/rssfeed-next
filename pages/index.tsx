import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [feedTitle, setFeedTitle] = useState('');
  const [feedItems, setFeedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await axios.get('api/rss');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, 'text/xml');
      const channel = xmlDoc.getElementsByTagName('channel')[0];
      setFeedTitle(channel.getElementsByTagName('title')[0].textContent);
      const items = xmlDoc.getElementsByTagName('item');
      const feedItems = [];
      for (let i = 0; i < items.length; i++) {
        feedItems.push({
          title: items[i].getElementsByTagName('title')[0].textContent,
          description: items[i].getElementsByTagName('description')[0].textContent,
          link: items[i].getElementsByTagName('guid')[0].textContent,
          pubDate: items[i].getElementsByTagName('pubDate')[0].textContent
        });
      }
      setFeedItems(feedItems);
    } catch (error) {
      console.error(error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = feedItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const reload = () => {
    setFeedTitle('');
    setFeedItems([]);
    setCurrentPage(1);
    fetchFeed();
  };

  return (
    <>
      <Head>
        <title>{feedTitle}</title>
        <meta name="description" content={`${feedTitle}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
      </header>
      <nav>
      </nav>
      <section>
        <Container>
          <Row>
            <Col xs={12}>
              <h2>{feedTitle}</h2>
            </Col>
          </Row>
        </Container>
      </section>
      <article>
        <Container>
          <Row>
            {currentItems.map((item) => (
              <Col key={item.link} xs={12} md={6} lg={4}>
                <h5>{item.title}</h5>
                <p>{item.pubDate}</p>
                <p>{item.description}</p>
                <p><a href={item.link} target="_blank" rel="noopener noreferrer">Read more</a></p>
              </Col>
            ))}
          </Row>
        </Container>
      </article>
      <aside>
      </aside>
      <footer>
        <Container>
          <Row>
            <Col xs={12} md={4} className="offset-md-4">
              <Button className="float-start" disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>&#8592; Back</Button>
              <Button className="float-end" disabled={currentPage === Math.ceil(feedItems.length / itemsPerPage)}
              onClick={() => paginate(currentPage + 1)}>Next &#8594;</Button>
              <p className="text-center"><Button variant="info" onClick={reload}>&#8593; Reload</Button></p>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={4} className="offset-md-4">
              <p className="text-center">Page {currentPage} of {Math.ceil(feedItems.length / itemsPerPage)}</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
    );
};

export default App;
