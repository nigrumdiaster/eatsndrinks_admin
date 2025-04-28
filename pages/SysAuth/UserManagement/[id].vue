<template>
  <MainTemplate>
      <template #header>
          <Breadcrumb>
              <BreadcrumbList>
                  <BreadcrumbItem class="hidden md:block">
                      <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator class="hidden md:block" />
                  <BreadcrumbItem class="hidden md:block">
                      <BreadcrumbLink href="/">Quản lý nguời dùng</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator class="hidden md:block" />
                  <BreadcrumbItem>
                      <BreadcrumbPage>Chỉnh sửa</BreadcrumbPage>
                  </BreadcrumbItem>
              </BreadcrumbList>
          </Breadcrumb>
      </template>
      
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h1 class="text-2xl font-bold">Chỉnh sửa người dùng</h1>
          <EditForm v-if="user" :user="user" @save="updateUser" @cancel="goBack" />
          <p v-else class="text-center text-gray-500">Đang tải dữ liệu...</p>
      </div>
  </MainTemplate>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useRuntimeConfig, useCookie, navigateTo } from '#app'
import MainTemplate from '~/components/layouts/MainTemplate.vue'
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue'
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue'
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue'
import BreadcrumbLink from '@/components/ui/breadcrumb/BreadcrumbLink.vue'
import BreadcrumbSeparator from '@/components/ui/breadcrumb/BreadcrumbSeparator.vue'
import BreadcrumbPage from '@/components/ui/breadcrumb/BreadcrumbPage.vue'
import EditForm from '~/components/organisms/SysAuth/UserManagement/EditForm.vue'

interface User {
  id: number;
  username: string;
  fullname: string;
  email: string;
}
interface UserResponse {
  message: string;
  user: User;
}

const route = useRoute();
const router = useRouter();
const user = ref<User | null>(null);
const toast = useToast();
const fetchUser = async () => {
  try {
    const config = useRuntimeConfig();
    const token = useCookie("auth_token");

    const response = await $fetch<UserResponse>(`${config.public.apiBase}/users/profile/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    console.log("User info:", response);
    user.value = response.user;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin user:", error);
    toast.error("Không tìm thấy thông tin user!");
    router.push("/user-management");
  }
};

const updateUser = async (updatedUser: User) => {
  try {
    const config = useRuntimeConfig();
    const token = useCookie("auth_token");

    await $fetch(`${config.public.apiBase}/users/update-profile-user/${updatedUser.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json"
      },
      body: {
        fullname: updatedUser.fullname,
        email: updatedUser.email,
      },
    });

    toast.success("Cập nhật thành công!");
    router.push("/user-management");
  } catch (error) {
    console.error("Lỗi khi cập nhật user:", error);
    toast.error("Cập nhật thất bại!");
  }
};

const goBack = () => {
  toast.warning(
    h("div", { class: "space-y-2" }, [
      h("p", "Bạn có chắc chắn muốn thoát không? Dữ liệu chưa lưu sẽ bị mất."),
      h("button", {
        onClick: () => {
          toast.clear();
          router.push("/user-management");
        },
        class: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition",
      }, "Thoát"),
    ]),
    { timeout: false, closeOnClick: false }
  );
};


onMounted(fetchUser);

</script>
