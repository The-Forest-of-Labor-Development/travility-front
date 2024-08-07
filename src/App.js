import { createContext, useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/common/StyledComponents';
import {
  ThemeProvider,
  useTheme,
  lightTheme,
  darkTheme,
} from './styles/common/Theme';
import { getMemberInfo } from './api/memberApi';
import Layout from './pages/common/header/Layout';
import AboutUsPage from './pages/main/AboutusPage';
import MainPage from './pages/main/MainPage';
import AccountBookListPage from './pages/accountbook/AccountBookListPage';
import AccountBookMainPage from './pages/accountbook/detail/AccountBookMainPage';
import LoginPage from './pages/member/LoginPage';
import SignupPage from './pages/member/SignupPage';
import MyInfoPage from './pages/member/MyInfoPage';
import MyCalendarPage from './pages/myCalendar/MyCalendarPage';
import MyReportPage from './pages/statistics/MyReportPage';
import UsersPage from './pages/admin/UsersPage';
import LoadingPage from './util/LoadingPage';
import AuthenticatedRoute from './util/AuthenticatedRoute';
import SettlementMainPage from './pages/accountbook/settlement/SettlementMainPage';
import SettlementExpenseListPage from './pages/accountbook/settlement/SettlementExpenseListPage';
import ForgotPasswordPage from './pages/member/password/ForgotPasswordPage';
import UpdatePasswordPage from './pages/member/password/UpdatePasswordPage';
import ExpenseStatisticPage from './pages/statistics/ExpenseStatisticPage';

export const MemberInfoContext = createContext();

function App() {
  const [memberInfo, setMemberInfo] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, loadTheme } = useTheme();

  useEffect(() => {
    loadTheme(); // 기존 선택 테마 로드

    const checkTokenStatus = async () => {
      try {
        const info = await getMemberInfo();
        if (info.username) {
          setMemberInfo(info);
        }
      } catch (error) {
        console.error('토큰 유효성 검사 중 오류 발생:', error);
        // if (location.pathname !== '/') {
        //   navigate('/login');
        // }
      }
    };

    checkTokenStatus();
  }, [navigate, location, loadTheme]);

  return (
    <MemberInfoContext.Provider value={{ memberInfo }}>
      <StyledThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <GlobalStyle />
        <div>
          <Routes>
            <Route path="/" element={<AboutUsPage />} />
            <Route path="/" element={<Layout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/loading" element={<LoadingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/settlement/:id" element={<SettlementMainPage />} />
              <Route
                path="/settlement/:id/expenses"
                element={<SettlementExpenseListPage />}
              />
              <Route
                path="/main"
                element={
                  <AuthenticatedRoute>
                    <MainPage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/dashboard/myreport"
                element={
                  <AuthenticatedRoute>
                    <MyReportPage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/dashboard/myinfo"
                element={
                  <AuthenticatedRoute>
                    <MyInfoPage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/dashboard/myinfo/update-password"
                element={
                  <AuthenticatedRoute>
                    <UpdatePasswordPage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/dashboard/mycalendar"
                element={
                  <AuthenticatedRoute>
                    <MyCalendarPage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/accountbook/list"
                element={
                  <AuthenticatedRoute>
                    <AccountBookListPage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/accountbook/detail/:id"
                element={
                  <AuthenticatedRoute>
                    <AccountBookMainPage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/accountbook/detail/:id/statistics"
                element={
                  <AuthenticatedRoute>
                    <ExpenseStatisticPage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AuthenticatedRoute>
                    <UsersPage />
                  </AuthenticatedRoute>
                }
              />
            </Route>
          </Routes>
        </div>
      </StyledThemeProvider>
    </MemberInfoContext.Provider>
  );
}

export default function WrappedApp() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
