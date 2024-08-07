import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAccountBookById,
  updateAccountBook,
} from "../../../api/accountbookApi";
import AccountBookDate from "./AccountBookDateCmp";
import ExpenseList from "./ExpenseListCmp";
import AccountBookMenu from "./AccountBookMenuCmp";
import TripInfo from "../../common/TripInfoCmp";
import UpdateTripInfo from "./UpdateTripInfoModal";
import AddBudget from "./AddBudgetModal";
import AddExpense from "./AddExpenseModal";
import { addBudgets } from "../../../api/budgetApi";
import { addExpense } from "../../../api/expenseApi";
import {
  handleSuccessSubject,
  handleFailureSubject,
} from "../../../util/swalUtils";
import styles from "../../../styles/accountbook/detail/AccountBookDetail.module.css";

const AccountBookMain = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accountBook, setAccountBook] = useState(null);
  const [selectedDate, setSelectedDate] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isTripInfoModalOpen, setIsTripInfoModalOpen] = useState(false);

  useEffect(() => {
    const fetchAccountBook = async () => {
      try {
        const data = await getAccountBookById(id);
        setAccountBook(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountBook();
  }, [id]);

  const getDateRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    endDate = new Date(endDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const dateList = accountBook
    ? getDateRange(accountBook.startDate, accountBook.endDate)
    : [];

  const handleDateChange = (selectedDate) => setSelectedDate(selectedDate);

  const handleShowAll = () => setSelectedDate("all");

  const handleShowPreparation = () => setSelectedDate("preparation");

  const handleShowAfter = () => setSelectedDate("after");

  //예산 수정
  const handleBudgetSubmit = async (budgets) => {
    try {
      await addBudgets(accountBook.id, budgets);
      handleSuccessSubject("예산", "수정");
    } catch (error) {
      console.error("Error updating budgets:", error);
      handleFailureSubject("예산", "수정");
    } finally {
      setIsBudgetModalOpen(false);
    }
  };

  //지출 추가
  const handleExpenseSubmit = async (expense) => {
    try {
      await addExpense(expense);
      handleSuccessSubject("지출", "추가");
    } catch (error) {
      console.error("Error:", error);
      handleFailureSubject("지출", "추가");
    } finally {
      setIsExpenseModalOpen(false);
    }
  };

  //가계부 수정
  const handleAccountBookSubmit = async (tripInfo) => {
    try {
      await updateAccountBook(accountBook.id, tripInfo);
      handleSuccessSubject("가계부", "수정");
    } catch (error) {
      console.error("Error updating AccountBook: ", error);
      handleFailureSubject("가계부", "수정");
    } finally {
      setIsTripInfoModalOpen(false);
    }
  };

  //지출 통계 이동
  const goExpenseStatistic = () => {
    navigate(`/accountbook/detail/${id}/statistics`);
  };

  if (loading) {
    return <div>Loading...🐷</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!accountBook) {
    return <div>Account book not found</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        <div className={styles.tripInfoAndMenu}>
          <TripInfo
            accountBook={accountBook}
            onClick={() => setIsTripInfoModalOpen(true)}
            isSettlement={false}
          />
          <AccountBookMenu
            onBudgetClick={() => setIsBudgetModalOpen(true)}
            onExpenseClick={() => setIsExpenseModalOpen(true)}
            goExpenseStatistic={goExpenseStatistic}
          />
        </div>
        <AccountBookDate
          accountBook={accountBook}
          dates={dateList}
          onDateChange={handleDateChange}
          onShowAll={handleShowAll}
          onShowPreparation={handleShowPreparation}
          onShowAfter={handleShowAfter}
        />
      </div>
      <ExpenseList accountBook={accountBook} selectedDate={selectedDate} />
      {isBudgetModalOpen && (
        <AddBudget
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          onSubmit={handleBudgetSubmit}
          accountBookId={accountBook.id}
          initialBudgets={accountBook.budgets}
        />
      )}
      {isExpenseModalOpen && (
        <AddExpense
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          onSubmit={handleExpenseSubmit}
          accountBookId={accountBook.id}
          accountBook={accountBook}
        />
      )}
      {isTripInfoModalOpen && (
        <UpdateTripInfo
          isOpen={isTripInfoModalOpen}
          onClose={() => setIsTripInfoModalOpen(false)}
          isSettlement={false}
          onSubmit={handleAccountBookSubmit}
          accountBook={accountBook}
        />
      )}
    </div>
  );
};

export default AccountBookMain;
