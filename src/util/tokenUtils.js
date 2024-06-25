import base64 from 'base-64';
import { checkToken } from '../api/memberApi';

//토큰 저장
export const saveToken = (token) => {
  return localStorage.setItem('Authorization', token);
};

//토큰 존재 여부
export const isTokenPresent = () => {
  return !!localStorage.getItem('Authorization');
};

//토큰 삭제
export const removeToken = () => {
  localStorage.removeItem('Authorization');
};

//토큰 추출
export const getToken = () => {
  return localStorage.getItem('Authorization');
};

//토큰 페이로드 디코딩
export const decodeToken = () => {
  const token = getToken().substring(7);
  const payload = token.substring(
    token.indexOf('.') + 1,
    token.lastIndexOf('.')
  );
  const decordingInfo = JSON.parse(base64.decode(payload));
  return decordingInfo;
};

//토큰 유효성 검사
export const validateToken = () => {
  if (isTokenPresent()) {
    return checkToken()
      .then(() => {
        return 'Token valid';
      })
      .catch((error) => {
        console.log(error);
        return 'Token expired';
      });
  } else {
    return Promise.resolve('Token null');
  }
};