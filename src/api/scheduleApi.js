import axiosInstance from "../util/axiosInterceptor";

//사용자가 등록한 일정(n박n일)
export const fetchEvents = async () => {
  try {
    const response = await axiosInstance.get("/accountBook/schedule");
    return response.data;
  } catch (error) {
    console.error("가계부 정보를 가져오는 중에 오류가 발생했습니다:", error);
    throw error;
  }
};

//날짜별 총 지출
export const fetchDailyExpenses = async (accountbookId) => {
  try {
    const response = await axiosInstance.get(
      `/accountBook/schedule/${accountbookId}`
    );

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && typeof response.data === "object") {
      return Object.entries(response.data).map(([date, amount]) => ({
        expenseDate: date,
        amount: amount,
      }));
    } else {
      console.error("Unexpected response data format:", response.data);
      return [];
    }
  } catch (error) {
    console.error(
      `날짜별 지출 정보를 가져오는 중에 오류가 발생했습니다:`,
      error
    );
    throw error;
  }
};

//accountbookId 로 모든 expenses 가져오기
export const fetchAllExpensesByAccountbookId = async (accountbookId) => {
  try {
    const response = await axiosInstance.get(
      `/accountBook/expenses/${accountbookId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching all expenses for accountBookId ${accountbookId}:`,
      error
    );
    throw error;
  }
};

// 지출 총합 계산(가중 평균)
export const fetchTotalExpenses = async (accountbookId) => {
  try {
    const response = await axiosInstance.get(
      `/accountBook/${accountbookId}/totalExpenses`
    );

    // 백엔드에서 반환된 데이터 구조
    const { expenses, exchangeRates } = response.data;

    // 환율을 고려한 금액 계산
    const calculatedTotalAmount = expenses.reduce((total, expense) => {
      const exchangeRate = exchangeRates[expense.curUnit] || 1;
      return total + expense.amount * exchangeRate;
    }, 0);

    return { totalAmount: calculatedTotalAmount, expenses, exchangeRates };
  } catch (error) {
    console.error(`accountbookId 오류 ${accountbookId}:`, error);
    throw error;
  }
};
