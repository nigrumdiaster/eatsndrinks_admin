<template>
  <div class="grid gap-4">
      <div class="grid gap-2">
          <Label for="username">Tên đăng nhập</Label>
          <Input id="username" v-model="user.username" type="text" placeholder="Tên đăng nhập" required />
      </div>
      <span class="text-red-500">(*) Chỉ có thể chỉnh sửa các mục bên dưới</span>
      <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" v-model="user.email" type="email" placeholder="Email" required />
      </div>
      <div class="grid gap-2">
          <Label for="fullname">Họ và tên</Label>
          <Input id="fullname" v-model="user.fullname" type="text" placeholder="Họ và tên" required />
      </div>
      <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="submit" class="w-full sm:w-60" @click="saveChanges">
              Lưu thay đổi
          </Button>
          <Button variant="destructive" type="button" class="w-full sm:w-60" @click="cancelChanges">
              Thoát
          </Button>
      </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from 'vue-toastification'
import { useRouter } from '#app';
// Định nghĩa sự kiện mà component này sẽ phát ra
const emit = defineEmits(["save", "cancel"]);

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({ username: '', email: '', fullname: '', password: '' }),
  },
});

const toast = useToast()
const router = useRouter();
const saveChanges = () => {
  emit("save", props.user);

};

const cancelChanges = () => {
  emit("cancel");
};
</script>
