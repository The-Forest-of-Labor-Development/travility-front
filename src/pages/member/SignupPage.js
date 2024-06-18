import { useState } from 'react';
import { signup, checkUsername } from '../../api/memberApi';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/member/SignupPage.module.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birth, setBirth] = useState('');

  //에러관리
  const [errorUsername, setErrorUsername] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorBirth, setErrorBirth] = useState('');
  const [isUsernameDuplicate, setIsUsernameDuplicate] = useState(null);

  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);

  const navigate = useNavigate();
  

  //비밀번호 공개 여부 표시
  const seePasswordHandler =()=>{
    setSeePassword(!seePassword);
  };

  const seeConfirmPasswordHandler = () => {
    setSeeConfirmPassword(!seeConfirmPassword);
  };


  //아이디 유효성 확인
  const vaildateUsername = (username) => {
    const regex = /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]{8,20}$/; //영소문자, 숫자 8~20자 이하
    return regex.test(username);
  };

  //아이디 에러 표시 여부
  const handleUsername = (e) => {
    setUsername(e.target.value);
    const isValid = vaildateUsername(e.target.value);
    if (!isValid) {
      //만족하지 않으면
      setErrorUsername('영소문자, 숫자 8~20자로 입력하세요.');
    } else {
      setErrorUsername('');
    }
    setIsUsernameDuplicate(null);
  };

  //아이디 중복 확인
  const handleDuplicateUsername = (e) => {
    e.preventDefault();
    checkUsername(username)
      .then((data) => {
        if (data.duplicate) {
          //중복인 경우
          setErrorUsername('중복 아이디입니다.');
          setIsUsernameDuplicate(true);
        } else {
          //중복이 아닌 경우
          setErrorUsername('사용 가능합니다.');
          setIsUsernameDuplicate(false);
        }
      })
      .catch((error) => console.log(error));
  };

  //비밀번호 유효성 검사
  const vaildatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-z0-9!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  //비밀번호 에러 표시 여부
  const handlePassword = (e) => {
    setPassword(e.target.value);
    const isValid = vaildatePassword(e.target.value);
    if (!isValid) {
      //만족하지 않으면
      setErrorPassword('영소문자, 숫자, 특수문자 8자 이상 입력하세요');
    } else {
      setErrorPassword('');
    }
  };

  //비밀번호 확인 에러 표시 여부
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setErrorConfirmPassword('비밀번호가 맞지 않습니다.');
    } else {
      setErrorConfirmPassword('');
    }
  };
  

  //이메일 유효성 검사
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  //이메일 에러 표시 여부
  const handleEmail = (e) => {
    setEmail(e.target.value);
    const isValid = validateEmail(e.target.value);
    if (!isValid) {
      setErrorEmail('이메일 형식이 올바르지 않습니다');
    } else {
      setErrorEmail('');
    }
  };

  //생일 유효성 검사
  const validateBirth = (birth) => {
    const currnetDate = new Date();
    const inputDate = new Date(birth);
    return inputDate <= currnetDate; //생년월일이 현재 날짜보다 이하여야 한다.
  };

  //생일 에러 표시 여부
  const handleBirth = (e) => {
    const date = new Date(e.target.value);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    const formatDate = year + '-' + month + '-' + day;

    setBirth(formatDate);

    const isValid = validateBirth(e.target.value);
    if (!isValid) {
      setErrorBirth('생일이 올바르지 않습니다');
    } else {
      setErrorBirth('');
    }
  };

  //회원 가입
  const handleSignup = () => {
    console.log(!isUsernameDuplicate);
    console.log(vaildateUsername(username));
    console.log(vaildatePassword(password));
    console.log(validateEmail(email));
    console.log(validateBirth(birth));
    if (
      !isUsernameDuplicate &&
      vaildateUsername(username) &&
      vaildatePassword(password) &&
      validateEmail(email) &&
      validateBirth(birth)
    ) {
      //유효성 검사를 모두 통과했을 경우
      const member = {
        username: username,
        password: password,
        email: email,
        birth: birth,
        createdDate: new Date(),
      };
      signup(member)
        .then(() => {
          console.log(member);
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            title: '회원가입 실패',
            text: '회원가입 중 문제가 발생했습니다.',
            icon: 'error',
            confirmButtonColor: '#2a52be',
          });
        });
      Swal.fire({
        title: '회원가입 성공',
        text: '로그인 페이지로 이동합니다.',
        icon: 'success',
        confirmButtonColor: '#2a52be',
      }).then(() => {
        navigate('/login');
      });
    } else {
      Swal.fire({
        title: '회원가입 실패',
        text: '양식이 올바르지 않습니다.',
        icon: 'error',
        confirmButtonColor: '#2a52be',
      });
    }
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_container_content}>
      <div className={styles.signup_container_header}>
        <p>회원가입</p>
        <p>
        반가워요! 가입을 위해 몇 가지만 확인할게요.
        </p>
      </div>
      <div className={styles.signup_container_form}>
        <form>
          <div className={styles.signup_title}>아이디</div>
          <div className={styles.signup_id_container}>
          <input
            type="text"
            placeholder="영소문자, 숫자를 포함한 8~20자"
            value={username}
            onChange={handleUsername}
            required
            className={styles.signup_input_id}
          ></input>
          <button
           onClick={handleDuplicateUsername}
           className={styles.signup_check_button}
           >중복 확인</button>
          </div>
          <div className={styles.signup_error}>{errorUsername}</div>
          

          <div className={styles.signup_title}>비밀번호</div>
          <div className={styles.signup_input_seepw_container}>
          <input
            type={seePassword ? "text" : "password"}
            placeholder="영문자, 숫자, 특수문자를 포함한 8자 이상"
            value={password}
            onChange={handlePassword}
            className={styles.signup_input_pw}
            required
          ></input>
          <button type="button" onClick={seePasswordHandler} 
          className={styles.toggle_pw_button}>
          {seePassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
          </div>
          <div className={styles.signup_error}>{errorPassword}</div>

          <div className={styles.signup_title}>비밀번호 확인</div>
          <div className={styles.signup_input_seecheckpw_container}>
          <input
            type={seeConfirmPassword ? "text" : "password"}
            placeholder="비밀번호를 재입력해주세요"
            value={confirmPassword}
            onChange={handleConfirmPassword}
            required
            className={styles.signup_input_checkpw}
          ></input>
          <button type="button" onClick={seeConfirmPasswordHandler} 
          className={styles.toggle_checkpw_button}>
          {seeConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
          </div>
          <div className={styles.signup_error}>{errorConfirmPassword}</div>

          <div className={styles.signup_title}>이메일</div>
          <input
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={handleEmail}
            required
            className={styles.signup_input_email}
          ></input>
          <div className={styles.signup_error}>{errorEmail}</div>
          <div className={styles.signup_title}>생년월일</div>
          <input
            type="date"
            placeholder="yyyy-mm-dd"
            value={birth}
            onChange={handleBirth}
            required
            className={styles.signup_input_date}
          ></input>
          <div className={styles.signup_error}>{errorBirth}</div>
        </form>
        <button type="submit" 
        onClick={handleSignup}
        className={styles.signup_action_button}>
          회원 가입
        </button>
      </div>
      </div>
    </div>
  );
};

export default SignupPage;