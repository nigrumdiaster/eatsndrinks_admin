<template>
  <MainTemplate>
    <template #header>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem class="hidden md:block">
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Trang dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </template>
    <!-- Nội dung chính của trang -->
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <!-- Nội dung của bạn ở đây -->
       <ProfileForm v-if="user" :user="user"/>
    </div>
  </MainTemplate>
</template>
<script lang="ts" setup>
import MainTemplate from '~/components/layouts/MainTemplate.vue'
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue'
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue'
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue'
import BreadcrumbLink from '@/components/ui/breadcrumb/BreadcrumbLink.vue'
import BreadcrumbSeparator from '@/components/ui/breadcrumb/BreadcrumbSeparator.vue'
import BreadcrumbPage from '@/components/ui/breadcrumb/BreadcrumbPage.vue'

import ProfileForm from '~/components/organisms/auth/ProfileForm.vue'

interface User {
  id: number;
  username: string;
  fullname: string;
  email: string;
}

interface UserApiResponse {
  message: string;
  user: User;
}


const user = ref<User | null>(null);
const config = useRuntimeConfig();
const token = useCookie('auth_token');
const fetchUserProfile = async () => {
  try {
    const data = await $fetch<UserApiResponse>(`${config.public.apiBase}/users/profile`, {headers: {
                Authorization: `Bearer ${token.value}`
            }});

    if (data.user) {
      user.value = data.user;
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin user:", error);
  }
};


onMounted(fetchUserProfile);
</script>