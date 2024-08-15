// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';
import {api} from "@/utils/request";
import cookie from "react-cookies";

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  // return api('/api/user/info', {});
  return request<{
    data: API.CurrentUser;
  }>('https://api.gabrlie.top/api/user/info', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + cookie.load('token') || '',
    },
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  // return request<Record<string, any>>('/api/user/logout', {
  //   method: 'POST',
  //   ...(options || {}),
  // });
  return api('/api/user/logout', {
    user_id: cookie.load('id')
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return api('/api/user/login', body);
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'update',
      ...(options || {}),
    }
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'post',
      ...(options || {}),
    }
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data:{
      method: 'delete',
      ...(options || {}),
    }
  });
}

/** 获取列表 POST /api/client/list */
export async function clientList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return api('/api/client/list', params)
}

/** 更新 POST /api/client/update */
export async function clientUpdate(params: Record<string, any>) {
  return api('/api/client/update', params)
}

/** 新建应用 POST /api/client/create */
export async function clientCreate(params: Record<string, any>) {
  return api('/api/client/create', params)
}

/** 删除 DELETE /api/rule */
export async function clientDelete(params: Record<string, any>) {
  return api('/api/client/delete', params)
}

/** 获取列表 POST /api/user/list */
export async function userList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
) {
  return api('/api/user/list', params);
}

/** 更新 POST /api/user/update */
export async function userUpdate(params: Record<string, any>) {
  return api('/api/user/update', params);
}

/** 新建用户 POST /api/user/signup */
export async function userCreate(params: Record<string, any>) {
  return api('/api/user/register', params);
}

/** 删除用户 DELETE /api/user/delete */
export async function userDelete(params: Record<string, any>) {
  return api('/api/user/delete', params);
}

/** 获取列表 POST /api/check/client/list */
export async function checkClientList(
  params: {
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
) {
  return api('/api/check/client/list', params);
}

/** 更新 POST /api/check/client/update */
export async function checkClientUpdate(params: Record<string, any>) {
  return api('/api/check/client/update', params);
}
