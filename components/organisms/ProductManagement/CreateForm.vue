<template>
  <div class="grid gap-4">
    <div class="grid gap-2">
      <Label for="name">Tên sản phẩm</Label>
      <Input id="name" v-model="form.name" type="text" placeholder="Tên sản phẩm" required />
    </div>

    <div class="grid gap-2">
      <Label for="description">Mô tả</Label>
      <Input id="description" v-model="form.description" type="text" placeholder="Mô tả" />
    </div>

    <div class="grid gap-2">
      <Label for="mainimage">Ảnh chính</Label>
      <Input id="mainimage" type="file" @change="(e: Event) => handleFileChange(e, 'main')" />
    </div>

    <div class="grid gap-2">
      <Label for="uploaded_images">Ảnh phụ</Label>
      <Input id="uploaded_images" type="file" @change="(e: Event) => handleFileChange(e, 'uploaded_images')" multiple/>
    </div>

    <div class="grid gap-2">
      <div class="grid gap-2">
        <Label for="price">Giá</Label>
        <Input id="price" v-model="form.price" type="number" min="0" placeholder="Giá" />
      </div>
    </div>

    <div class="grid gap-2">
      <Label for="category">Danh mục</Label>
      <Select v-model="form.category">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Chọn danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="grid gap-2">
      <div class="grid gap-2">
        <Label for="is_active">Hiển thị</Label>
        <input id="is_active" v-model="form.is_active" type="checkbox" class="w-5 h-5" />
      </div>
    </div>

    <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
      <Button type="submit" class="w-full sm:w-60" @click="submitForm">
        Tạo sản phẩm
      </Button>
      <Button variant="destructive" type="button" class="w-full sm:w-60" @click="cancelCreate">
        Thoát
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from 'vue-toastification'
import { useRouter } from '#app'

const toast = useToast()
const router = useRouter()

interface Category {
  id: number;
  name: string;
}

const props = defineProps({
  categories: {
    type: Array as () => Category[],
    required: true
  }
})

const emit = defineEmits(['create-product', 'reset-form'])

const form = ref({
  name: '',
  description: '',
  mainimage: null as File | null,
  uploaded_images: [] as File[],
  price: 0,
  category: '',
  is_active: true,
})

const handleFileChange = (e: Event, type: 'main' | 'uploaded_images' = 'main') => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    if (type === 'main') {
      form.value.mainimage = target.files[0]
    } else {
      form.value.uploaded_images = Array.from(target.files)
    }
  }
}

const submitForm = () => {
  const { name, price, category } = form.value
  if (!name || !price || !category) {
    toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!')
    return
  }

  const formData = new FormData()

  // Thêm các trường cơ bản
  formData.append('name', form.value.name)
  formData.append('description', form.value.description || '')
  formData.append('price', String(form.value.price))
  formData.append('category', String(form.value.category))
  formData.append('is_active', String(form.value.is_active))
  
  // Thêm ảnh chính nếu có
  if (form.value.mainimage instanceof File) {
    formData.append('mainimage', form.value.mainimage)
  }

  // Thêm các ảnh phụ nếu có
  if (form.value.uploaded_images.length > 0) {
    form.value.uploaded_images.forEach((file) => {
      formData.append('uploaded_images', file)
    })
  }

  emit('create-product', formData)
}

const cancelCreate = () => {
  toast.warning(h("div", [
    "Bạn có chắc chắn muốn thoát không? Dữ liệu chưa lưu sẽ bị mất.",
    h("button", {
      onClick: () => {
        toast.clear()
        router.push('/product-management')
      },
      class: "ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition"
    }, "Thoát")
  ]), {
    timeout: 10000,
    closeOnClick: false,
  })
}
</script>
