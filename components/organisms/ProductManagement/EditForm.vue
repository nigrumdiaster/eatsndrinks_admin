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
      <div v-if="form.mainimage_url" class="mb-2">
        <img :src="form.mainimage_url" alt="mainimage" class="h-24 rounded" />
      </div>
      <Input id="mainimage" type="file" @change="(e: Event) => handleFileChange(e, 'main')" />
    </div>

    <div class="grid gap-2">
      <Label for="uploaded_images">Ảnh phụ</Label>
      <div class="flex gap-2 mb-2" v-if="form.images && form.images.length">
        <img v-for="img in form.images" :key="img.id" :src="img.image" class="h-16 rounded" />
      </div>
      <Input id="uploaded_images" type="file" @change="(e: Event) => handleFileChange(e, 'uploaded_images')" multiple/>
    </div>

    <div class="grid gap-2">
      <Label for="price">Giá</Label>
      <Input id="price" v-model="form.price" type="number" min="0" placeholder="Giá" />
    </div>

    <div class="grid gap-2">
      <Label for="flash_sale_price">Giá Flash Sale</Label>
      <Input id="flash_sale_price" v-model="flashSalePriceProxy" type="number" min="0" placeholder="Giá Flash Sale" />
    </div>

    <div class="grid gap-2">
      <Label for="flash_sale_start">Bắt đầu Flash Sale</Label>
      <Input id="flash_sale_start" v-model="flashSaleStartProxy" type="datetime-local" />
    </div>

    <div class="grid gap-2">
      <Label for="flash_sale_end">Kết thúc Flash Sale</Label>
      <Input id="flash_sale_end" v-model="flashSaleEndProxy" type="datetime-local" />
    </div>

    <div class="grid gap-2">
      <Label for="category">Danh mục</Label>
      <Input id="category" v-model="form.category" type="number" placeholder="ID danh mục" />
    </div>

    <div class="grid gap-2">
      <Label for="is_active">Hiển thị</Label>
      <input id="is_active" v-model="form.is_active" type="checkbox" class="w-5 h-5" />
    </div>

    <div class="grid gap-2">
      <Label>Ngày tạo</Label>
      <div>{{ form.created_at }}</div>
    </div>

    <div class="grid gap-2">
      <Label>Ngày cập nhật</Label>
      <div>{{ form.updated_at }}</div>
    </div>

    <div class="grid gap-2">
      <Label>Đang Flash Sale?</Label>
      <div>{{ form.is_flash_sale_active }}</div>
    </div>

    <div class="grid gap-2">
      <Label>Giá hiện tại</Label>
      <div>{{ form.current_price }}</div>
    </div>

    <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
      <Button type="submit" class="w-full sm:w-60" @click="submitForm">
        Lưu thay đổi
      </Button>
      <Button variant="destructive" type="button" class="w-full sm:w-60" @click="cancelCreate">
        Thoát
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from 'vue-toastification'
import { useRouter, useRoute } from '#app'

const toast = useToast()
const router = useRouter()
const route = useRoute()

const emit = defineEmits(['create-product', 'reset-form'])

const form = ref({
  id: null,
  name: '',
  description: '',
  mainimage: null as File | null,
  mainimage_url: '',
  images: [] as Array<{ id: number; image: string; product: number }>,
  uploaded_images: [] as File[],
  price: 0,
  flash_sale_price: null as number | null,
  flash_sale_start: null as string | null,
  flash_sale_end: null as string | null,
  category: 0,
  is_active: true,
  created_at: '',
  updated_at: '',
  is_flash_sale_active: null,
  current_price: 0,
})

// Proxy for flash_sale_price to avoid null assignment to Input
const flashSalePriceProxy = computed({
  get() {
    return form.value.flash_sale_price ?? ''
  },
  set(val: string | number) {
    form.value.flash_sale_price = val === '' ? null : Number(val)
  }
})

// Proxy for flash_sale_start to avoid null assignment to Input
const flashSaleStartProxy = computed({
  get() {
    return form.value.flash_sale_start ?? ''
  },
  set(val: string | number) {
    form.value.flash_sale_start = val === '' ? null : String(val)
  }
})

// Proxy for flash_sale_end to avoid null assignment to Input
const flashSaleEndProxy = computed({
  get() {
    return form.value.flash_sale_end ?? ''
  },
  set(val: string | number) {
    form.value.flash_sale_end = val === '' ? null : String(val)
  }
})

const fetchProduct = async () => {
  const id = route.params.id
  try {
    const res = await $fetch(`/api/products/${id}/`)
    const product = res as {
      mainimage: string
      images?: Array<{ id: number; image: string; product: number }>
      price: number | string
      [key: string]: any
    }
    form.value = {
      ...form.value,
      ...(product && typeof product === 'object'
        ? {
            ...product,
            mainimage: null, // Ensure mainimage stays a File or null
            mainimage_url: product.mainimage,
            images: product.images || [],
            price: Number(product.price),
          }
        : {}),
    }
  } catch (e) {
    toast.error('Không thể tải dữ liệu sản phẩm')
  }
}

onMounted(fetchProduct)

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
  if (!name || !price || category === null) {
    toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!')
    return
  }

  const formData = new FormData()

  for (const [key, value] of Object.entries(form.value)) {
    if (key === 'uploaded_images' && Array.isArray(value)) {
      value.forEach((file) => {
        if (file instanceof File) {
          formData.append('uploaded_images', file)
        }
      })
    } else if (value !== null && value !== undefined && !(value instanceof Array)) {
      if (value instanceof File) {
        formData.append(key, value)
      } else {
        formData.append(key, String(value))
      }
    }
  }

  emit('create-product', formData)
}


const cancelCreate = () => {
  router.push('/product-management')
}
</script>
