<template>
  <LoginForm @login="handleLogin" />
</template>
  
<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth"; // Import auth store
import { useToast } from "vue-toastification";
import LoginForm from '~/components/organisms/auth/LoginForm.vue'

const loading = ref(false);

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const handleLogin = async (form: { username: string; password: string }) => {
  loading.value = true;
  try {
    await authStore.login(form.username, form.password);
    toast.success("Đăng nhập thành công!");
    router.push("/");
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    toast.error("Đăng nhập thất bại! Hãy kiểm tra lại tài khoản và mật khẩu.");
  } finally {
    loading.value = false;
  }
};
</script>
