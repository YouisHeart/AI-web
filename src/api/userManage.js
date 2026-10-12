import axios from '@/http/request.js'

// 获取用户列表
export function userList(params) {
    return axios.get('/user/list', {
        params: {
            pageNum: params.pageNum,
            pageSize: params.pageSize,
            username: params.username || undefined
        }
    })
}

// 删除用户
export function deleteUser(ids) {
    return axios.delete('/user/delete', {
        data:ids
    })
}