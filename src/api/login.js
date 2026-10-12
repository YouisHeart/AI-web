import axios from '@/http/request.js'


export function login(username, password) {
    // 后端登录接口使用表单参数，而不是 JSON 请求体
    return axios.post("/user/login", new URLSearchParams({
        username,
        password
    }))
}

// 用户注册
export function register(data) {
    return axios.post("/user/register", data)
}

export function userInfo() {
    // 后端登录接口使用表单参数，而不是 JSON 请求体
    return axios.get("/user/userInfo" )
}


export function updatepassword(data) {
    return axios.patch("/user/updatePwd", data)
}

