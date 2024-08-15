import {ProFormText} from "@ant-design/pro-components";
import {ChangeEvent, useEffect, useState} from "react";
import {SafetyCertificateOutlined} from "@ant-design/icons";
import {Alert} from "antd";
import {api} from "@/utils/request";

interface CaptchaInputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    setToken: (token: string) => void;
}

const CaptchaInput: React.FC<CaptchaInputProps> = ({ value, onChange, error, setToken }) => {
    const [captchaImage, setCaptchaImage] = useState<string>('');

    const generateToken = (): string => Math.random().toString(36).substr(2);

    const fetchCaptcha = (): void => {
        const newToken = generateToken();
        setToken(newToken);

        api('/api/captcha', { token: newToken })
          .then(response => {
              setCaptchaImage(response.captcha);
          })
          .catch(error => {
              console.error('获取验证码失败', error);
          });
    };

    useEffect(() => {
        fetchCaptcha();
    }, []);

    return (
      <div style={{marginTop: 16}}>
          <div style={{display: "flex", alignItems: "center"}}>
              <ProFormText
                name="captcha"
                fieldProps={{
                    size: "large",
                    prefix: <SafetyCertificateOutlined/>,
                    value: value,
                    onChange: onChange,
                }}
                placeholder="请输入验证码"
                rules={[
                    {
                        required: true,
                        message: "请输入验证码!",
                    },
                ]}
              />
              <img
                src={captchaImage}
                onClick={fetchCaptcha}
                style={{cursor: "pointer", marginLeft: 8, marginBottom: 24, borderRadius: 8}}
                alt="点击刷新验证码"
              />
          </div>
          {error && <Alert message={error} type="error" showIcon/>}
      </div>
    );
};

export default CaptchaInput;
