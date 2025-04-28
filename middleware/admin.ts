export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();
    const { fetchUser, checkAdmin, isAuthenticated, isAdmin } = authStore;
  
    // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    if (!isAuthenticated) {
      return navigateTo("/login");
    }
  
    // Nếu chưa kiểm tra quyền admin, gọi API để kiểm tra
    if (isAdmin === false) {
      try {
        await fetchUser();
        await checkAdmin();
      } catch (error) {
        console.error("Lỗi kiểm tra admin:", error);
        return navigateTo("/login");
      }
    }
  
    // Nếu không phải admin, chuyển hướng về trang chủ
    if (!isAdmin) {
      return navigateTo("/");
    }
  });
  