import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAccountBooks, deleteAccountBook } from '../../api/accountbookApi';
import styles from '../../styles/accountbook/AccountBookListPage.module.css';
import { Button, Input } from '../../styles/StyledComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { selectStyles2 } from '../../util/CustomStyles';
import TripInfo from '../../components/TripInfo';

const AccountBookListPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [accountBooks, setAccountBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [sort, setSort] = useState({ label: '최신순', value: 'new' });
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountBooks = async () => {
      try {
        const data = await getAccountBooks(sort.value);
        if (Array.isArray(data)) {
          setAccountBooks(data);
        } else {
          setError(new Error('Unexpected response format'));
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountBooks();
  }, [id, sort]);

  //실시간 검색 필터링
  const filteredAccountBooks = accountBooks.filter((accountBook) => {
    const lowerSearchText = searchText.toLowerCase(); //겁색어 소문자로 변경
    return (
      accountBook.title.toLowerCase().includes(lowerSearchText) ||
      accountBook.countryName.toLowerCase().includes(lowerSearchText)
    );
  });

  const handleAccountBookClick = (accountBook) => {
    if (!isDeleteMode) {
      navigate(`/accountbook/detail/${accountBook.id}`);
    } else {
      handleSelectBook(accountBook);
    }
  };

  const sortOptions = [
    { value: 'new', label: '최신순' },
    { value: 'old', label: '오래된순' },
    { value: 'highest', label: '높은지출순' },
    { value: 'lowest', label: '낮은지출순' },
  ];

  const handleSort = (sortOption) => {
    setSort(sortOption);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleDeleteBooks = async () => {
    try {
      await Promise.all(selectedBooks.map((id) => deleteAccountBook(id)));
      setAccountBooks((prevBooks) =>
        prevBooks.filter((book) => !selectedBooks.includes(book.id))
      );
      setIsDeleteMode(false);
      setSelectedBooks([]);
    } catch (error) {
      console.error('Failed to delete account books:', error);
    }
  };

  const handleSelectBook = (accountBook) => {
    setSelectedBooks((prevSelectedBooks) =>
      prevSelectedBooks.includes(accountBook.id)
        ? prevSelectedBooks.filter((id) => id !== accountBook.id)
        : [...prevSelectedBooks, accountBook.id]
    );
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedBooks([]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.accountBook_list_page}>
      {accountBooks.length > 0 && (
        <>
          <div className={styles.accountBook_list_header}>
            <div className={styles.sort_search_container}>
              <Select
                id="sort"
                value={sort}
                onChange={handleSort}
                options={sortOptions}
                className={styles.sortType}
                styles={selectStyles2}
              ></Select>
              <Input
                className={styles.search}
                type="text"
                value={searchText}
                onChange={handleSearch}
                placeholder="검색어를 입력하세요"
              ></Input>
            </div>

            <div className={styles.action_buttons}>
              <Button
                className={styles.delete_button}
                onClick={toggleDeleteMode}
              >
                {isDeleteMode ? '취소' : '삭제'}
              </Button>
              {isDeleteMode && (
                <Button
                  className={styles.confirm_delete_button}
                  onClick={handleDeleteBooks}
                  disabled={selectedBooks.length === 0}
                >
                  선택 삭제
                </Button>
              )}
            </div>
          </div>
        </>
      )}
      {accountBooks.length === 0 ? (
        <div className={styles.no_account_book}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={styles.no_account_book_icon}
          />
          <div>
            작성하신 가계부가 없어요
            <br />
            가계부를 작성하시면 전체 가계부를 볼 수 있어요🐷
          </div>
        </div>
      ) : (
        <div className={styles.accountBook_list_grid_container}>
          {filteredAccountBooks.map((accountBook) => (
            <TripInfo
              key={accountBook.id}
              accountBook={accountBook}
              onClick={handleAccountBookClick}
              isSelected={selectedBooks.includes(accountBook.id)}
              onSelect={handleSelectBook}
              isDeleteMode={isDeleteMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountBookListPage;
