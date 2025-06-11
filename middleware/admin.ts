export default defineNuxtRouteMiddleware(async (to, from) => {
    // Only apply middleware for admin routes
    if (!to.path.startsWith('/admin')) {
        return;
    }

    const authStore = useAuthStore();
    const { fetchUser, checkAdmin, isAuthenticated, isAdmin } = authStore;
  
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return navigateTo("/login");
    }
  
    // If admin status hasn't been checked yet
    if (isAdmin === undefined) {
      try {
        await fetchUser();
        await checkAdmin();
      } catch (error) {
        console.error("Error checking admin status:", error);
        return navigateTo("/login");
      }
    }
  
    // If not admin after checking, redirect to home
    if (!isAdmin) {
      return navigateTo("/");
    }
  });
  