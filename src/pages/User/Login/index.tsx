import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/api';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useModel, Helmet } from '@umijs/max';
import {Alert, message} from 'antd';
import React, {useState} from 'react';
import { flushSync } from 'react-dom';
import { createStyles } from 'antd-style';
import cookie from 'react-cookies';
import CaptchaInput from "@/pages/User/components/CaptchaInput";

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

interface LoginParams {
  email: string;
  password: string;
  captcha: string;
  token: string;
}

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const intl = useIntl();

  const startLogin = async () => {
      await fetchUserInfo();
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
  }

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
    console.log(userInfo);
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const msg = await login({ ...values, type });
      message.success('登录成功！');
      cookie.save('token', msg.token, { path: '/' })
      cookie.save('id', msg.user.id, { path: '/' })
      // 如果成功，跳转到首页
      await startLogin();
      return;
    } catch (error) {
      message.error(`${error.message}，请重试！`);
    }
  };
  const { status, type: loginType } = userLoginState;
  const [captchaToken, setCaptchaToken] = useState('');

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          江汉大学授权中心
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          initialValues={{
            autoLogin: true,
          }}
          logo='https://s3.cn.bing.net/th?id=OJ.bL7FLsLvRdEPaQ&qlt=80&o=6&dpr=1.8&pid=SANGAM'
          title={'江汉大学授权中心'}
          subTitle={` `}
          onFinish={async (values) => {
            values.token = captchaToken;
            await handleSubmit(values as API.LoginParams);
          }}
        >
          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/ant.design)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={"邮箱: 13761983502@qq.com"}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入邮箱!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'密码: admin123'}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
              <CaptchaInput
                value={userLoginState.captcha}
                onChange={(e) => setUserLoginState({ ...userLoginState, captcha: e.target.value })}
                error={userLoginState.errors?.captcha}
                setToken={setCaptchaToken}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
