import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { PuffLoader } from "react-spinners";
import '../css/Search.scss'
import { Pagination } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SearchItem from '../components/SearchItem';
import { fetchAPIWithoutBody } from '../../fetchApi';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1dc483',
      contrastText: '#fff',
    }
  },
});

const Search = () => {
  const [param] = useSearchParams();
  const query = param.get("q");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setLoading(true);
    fetchAPIWithoutBody(`/item/?search=${query}`, 'GET').then(e => {
      if (e.success) {
        setData(e.data.items);
      } else {
        setData([]);
      }
      setLoading(false);
    });
  }, [query]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className='search-container'>
      <h1 className="search-title">Tìm kiếm với từ khóa: {query}</h1>
      {loading ? (
        <PuffLoader color='#1dc483' className='loader' />
      ) : data.length === 0 ? (
        <div className="no-results">
          <h2>Không tìm thấy kết quả</h2>
        </div>
      ) : (
        <>
          <div className="results">
            {paginatedData.map((item, index) => (
              <SearchItem key={index} props={item} />
            ))}
          </div>
          <div className="pagination">
            <ThemeProvider theme={theme}>
              <Pagination 
                count={Math.ceil(data.length / itemsPerPage)} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                showFirstButton 
                showLastButton
              />
            </ThemeProvider>
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
