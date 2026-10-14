import { defineStore } from "pinia";
import { login, userInfo } from "@/api/login";
import { setToken, removeToken } from "@/composables/auth.js";
import { ElMessage } from "element-plus";


export const useUserStoreHook = defineStore("userInfo", {
  state() {
    return {
      username: "",
      userPic: "",
      accessToken: ""
    };
  },
  getters: {},
  actions: {
    // 登录
    storeUserLogin({ username, password }) {
      return login(username, password).then((res) => {
        // 后端返回结构：{ code: 0, data: "token" }
        // axios 响应拦截器已经取出了 data，因此这里通常直接是 token 字符串
        const token = typeof res.data === "string" ? res.data : res.data?.token;
        if (!token) {
          ElMessage.error(res.message || "登录失败");
        }

        setToken(token);
        this.accessToken = token;
        return token;
      });
    },

    // 获取用户信息
    storeUserInfo() {
      return userInfo().then((res) => {
        this.username = res.data.username;
        this.userPic = res.data.userPic;
        return res
      }).catch(err => {
        console.error("获取用户信息失败", err)
      })
    },

    // 更新头像状态
    updateUserAvatar(avatarUrl) {
      this.userPic = avatarUrl;
    },

    // 退出登录
    async storeLogout() {
      removeToken();
      this.accessToken = "";
      this.username = "";
      this.userPic = "";
    }
  },

  // 开启数据缓存
  persist: true,
});

export function useUserStore() {
  return useUserStoreHook();
}
