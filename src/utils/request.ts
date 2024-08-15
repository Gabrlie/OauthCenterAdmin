import {message, version} from "antd";
import {request} from "@umijs/max";
import Cookies from 'react-cookies'
import {loginOut} from "@/components/RightContent/AvatarDropdown";
import cookie from "react-cookies";

export async function api(path: string, parameter: Record<string, any>, method: string = 'POST') {
  const defaultToken = ''
  const defaultPath = 'https://api.gabrlie.top'

  const token = Cookies.load('token')
  // const id = Cookies.load('id')
  // 发出请求
  const res = await request(defaultPath+path, {
    method: method,
    // 直接用原始参数
    data: parameter,
    charset: "utf8",
    responseType: 'json', // default
    headers: {
      Authorization: `Bearer ${token || defaultToken}`,
    },
  });
  const {code, data, msg} = res;
  // 错误处理
  if (code !== 200 && code) {
    switch (code) {
      case '401':
        message.error(data || 'token过期请重新登录');
        loginOut(false);
        break;
      default:
        // message.error((msg ? msg : data) || '操作失败');
    }
    return Promise.reject(res);
  }
  return await Promise.resolve(data);
}
