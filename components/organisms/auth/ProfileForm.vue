<template>
  <h1 v-if="!isEditing" class="text-2xl font-bold">Thông tin cá nhân</h1>
  <h1 v-else class="text-2xl font-bold">Chỉnh sửa thông tin cá nhân</h1>
  <div class="grid gap-4 sm:grid-cols-3 items-start">
    <div class="grid gap-4">
      <div v-if="!isEditing" class="grid gap-2">
        <Label for="username">Tên đăng nhập</Label>
        <Input id="username" v-model="editableUser.username" type="username" disabled/>
      </div>
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input id="email" v-model="editableUser.email" type="email" :disabled="!isEditing"/>
      </div>
      <div class="grid gap-2">
        <Label for="fullname">Họ và tên</Label>
        <Input id="fullname" v-model="editableUser.fullname" type="text" :disabled="!isEditing"/>
      </div>
    </div>
    <div v-if="isEditing" class="border-r-2 border-gray-300 h-full"></div>
    <div v-if="isEditing" class="grid gap-4 h-full">
      <span class="text-red-500">(*) Chỉ nhập khi muốn thay đổi mật khẩu</span>
      <div class="grid gap-2">
        <Label for="oldPassword">Mật khẩu cũ</Label>
        <Input id="oldPassword" v-model="passwords.oldPassword" type="password"/>
      </div>
      <div class="grid gap-2">
        <Label for="newPassword">Mật khẩu mới</Label>
        <Input id="newPassword" v-model="passwords.newPassword" type="password"/>
      </div>
      <div class="grid gap-2">
        <Label for="confirmNewPassword">Nhập lại mật khẩu mới</Label>
        <Input id="confirmNewPassword" v-model="passwords.confirmNewPassword" type="password"/>
      </div>
    </div>
  </div>
  <div v-if="!isEditing" class="flex flex-col gap-2 sm:flex-row sm:justify-end">
    <Button class="w-full sm:w-60" @click="isEditing = true">
      Chỉnh sửa
    </Button>
  </div>
  <div v-else class="flex flex-col gap-2 sm:flex-row sm:justify-end">
    <Button type="submit" class="w-full sm:w-60" @click="saveChanges">
      Lưu thay đổi
    </Button>
    <Button variant="destructive" type="button" class="w-full sm:w-60" @click="cancelEdit">
      Thoát
    </Button>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


const props = defineProps<{ user: { fullname?: string; username?: string; email?: string } }>();
const isEditing = ref(false);
const editableUser = reactive({ ...props.user });
const passwords = reactive({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
const toast = useToast();

const saveChanges = async () => {
  // Kiểm tra xem có thay đổi thông tin không
  const isUserChanged =
    editableUser.fullname !== props.user.fullname ||
    editableUser.email !== props.user.email;

  const isPasswordChanged =
    passwords.oldPassword || passwords.newPassword || passwords.confirmNewPassword;

  if (!isUserChanged && !isPasswordChanged) {
    toast.warning(h("div", [
      "Thông tin chưa được thay đổi hoặc nhập mới.",
      h("button", {
        onClick: () => {
          isEditing.value = false;
          toast.clear();
        },
        class: "ml-4 px-2 py-1 bg-red-500 text-white rounded"
      }, "Thoát")
    ]), {
      timeout: 10000,
      closeOnClick: false,
    });
    return;
  }

  try {
    if (passwords.newPassword && passwords.newPassword !== passwords.confirmNewPassword) {
      toast.error("Mật khẩu mới và nhập lại mật khẩu mới không khớp!");
      return;
    }

    const payload = {
      fullname: editableUser.fullname,
      email: editableUser.email,
      oldPassword: passwords.oldPassword || undefined,
      newPassword: passwords.newPassword || undefined
    };

    const config = useRuntimeConfig();
    const token = useCookie('auth_token');

    await $fetch(`${config.public.apiBase}/users/update-profile-user`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      method: 'PUT',
      body: payload
    });

    toast.success("Thông tin đã được cập nhật thành công!");
    isEditing.value = false;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin", error);
    toast.error("Có lỗi xảy ra khi cập nhật!");
  }
};



const cancelEdit = () => {
  // Khôi phục dữ liệu từ props ban đầu
  Object.assign(editableUser, { ...props.user });

  // Xóa mật khẩu nhập vào
  Object.assign(passwords, { oldPassword: '', newPassword: '', confirmNewPassword: '' });

  // Thoát chế độ chỉnh sửa
  isEditing.value = false;
};

</script>