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
            <BreadcrumbLink href="/combo-management">Quản lý combo</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Thêm combo mới</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </template>

    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1 class="text-2xl font-bold">Thêm combo mới</h1>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="name">Tên combo</Label>
          <Input id="name" v-model="form.name" type="text" placeholder="Tên combo" required />
        </div>

        <div class="grid gap-2">
          <Label for="description">Mô tả</Label>
          <Input id="description" v-model="form.description" type="text" placeholder="Mô tả" />
        </div>

        <div class="grid gap-2">
          <Label for="discount_amount">Giảm giá (VNĐ)</Label>
          <Input id="discount_amount" v-model="form.discount_amount" type="number" placeholder="Giảm giá" />
        </div>

        <div class="flex items-center gap-2">
          <input id="is_active" type="checkbox" v-model="form.is_active" class="w-4 h-4" />
          <Label for="is_active">Kích hoạt combo</Label>
        </div>

        <!-- Combo Items Section -->
        <div class="border rounded-lg p-4">
          <h2 class="text-lg font-semibold mb-4">Sản phẩm trong combo</h2>
          
          <!-- Add New Item -->
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">ID sản phẩm</label>
              <Input
                v-model="newItem.product"
                placeholder="Nhập ID sản phẩm"
              />
              <!-- Product Info Display -->
              <div v-if="productInfo" class="mt-2 p-3 border rounded-lg bg-gray-50">
                <div class="flex items-center gap-3">
                  <img :src="productInfo.image" :alt="productInfo.name" class="w-16 h-16 object-cover rounded">
                  <div>
                    <h3 class="font-medium">{{ productInfo.name }}</h3>
                    <p class="text-gray-600">{{ productInfo.price }} đ</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-32">
              <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
              <Input
                v-model="newItem.quantity"
                type="text"
                placeholder="Nhập số lượng"
              />
            </div>
            <div class="flex items-end">
              <Button @click="addItem" class="bg-primary text-white" :disabled="!productInfo">
                Thêm
              </Button>
            </div>
          </div>

          <!-- Combo Items List -->
          <div class="space-y-2">
            <div v-for="(item, index) in form.combo_items" :key="index" class="flex items-center gap-4 p-2 border rounded">
              <div class="flex-1 flex items-center gap-3">
                <img v-if="item.product_image" :src="item.product_image" :alt="item.product_name" class="w-12 h-12 object-cover rounded">
                <div>
                  <div class="font-medium">{{ item.product_name }}</div>
                  <div class="text-sm text-gray-600">{{ item.product_price }} đ</div>
                </div>
              </div>
              <Input 
                v-model="item.quantity" 
                type="number" 
                class="w-32"
                min="1"
              />
              <Button variant="destructive" @click="removeComboItem(index)">
                Xóa
              </Button>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="submit" class="w-full sm:w-60" @click="createCombo">
            Tạo combo
          </Button>
          <Button variant="destructive" type="button" class="w-full sm:w-60" @click="cancelCreate">
            Hủy
          </Button>
        </div>
      </div>
    </div>
  </MainTemplate>
</template>

<script setup lang="ts">
import { ref, onMounted, h, watch, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useRuntimeConfig, useCookie, useRouter } from '#app'
import MainTemplate from '~/components/layouts/MainTemplate.vue'
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue'
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue'
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue'
import BreadcrumbLink from '@/components/ui/breadcrumb/BreadcrumbLink.vue'
import BreadcrumbSeparator from '@/components/ui/breadcrumb/BreadcrumbSeparator.vue'
import BreadcrumbPage from '@/components/ui/breadcrumb/BreadcrumbPage.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ComboItem {
  product: number | string;
  quantity: number;
  product_name?: string;
  product_price?: string;
  product_image?: string;
}

interface ProductResponse {
  name: string;
  price: string;
  mainimage: string;
}

const router = useRouter()
const toast = useToast()
const config = useRuntimeConfig()
const token = useCookie('access_token')

const newItem = ref<ComboItem>({ product: '', quantity: 1 })
const productInfo = ref<{name: string, price: string, image: string} | null>(null)
const searchTimeout = ref<number | null>(null)

const form = ref({
  name: '',
  description: '',
  discount_amount: 0,
  is_active: true,
  combo_items: [] as ComboItem[]
})

const fetchProductInfo = async (productId: string | number) => {
  try {
    if (!productId) {
      productInfo.value = null
      return
    }
    
    const response = await $fetch<ProductResponse>(`${config.public.apiBase}/catalogue/products/${productId}/`, {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    
    productInfo.value = {
      name: response.name,
      price: response.price,
      image: response.mainimage
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sản phẩm:', error)
    productInfo.value = null
    toast.error('Không tìm thấy sản phẩm với ID này!')
  }
}

// Watch for changes in product ID input with debounce
watch(() => newItem.value.product, (newValue) => {
  // Clear previous timeout if exists
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  // Set new timeout
  searchTimeout.value = window.setTimeout(() => {
    if (newValue) {
      fetchProductInfo(newValue)
    } else {
      productInfo.value = null
    }
  }, 500) // Wait for 500ms after user stops typing
})

// Clean up timeout when component is unmounted
onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})

const addItem = () => {
  if (newItem.value.product && newItem.value.quantity && productInfo.value) {
    form.value.combo_items.push({ 
      product: Number(newItem.value.product), 
      quantity: Number(newItem.value.quantity),
      product_name: productInfo.value.name,
      product_price: productInfo.value.price,
      product_image: productInfo.value.image
    })
    newItem.value = { product: '', quantity: 1 }
    productInfo.value = null
  }
}

const removeComboItem = (index: number) => {
  form.value.combo_items.splice(index, 1)
}

const createCombo = async () => {
  try {
    if (!token.value) return;

    if (!form.value.name) {
      toast.error('Vui lòng nhập tên combo!')
      return
    }

    if (form.value.combo_items.length === 0) {
      toast.error('Vui lòng thêm ít nhất một sản phẩm vào combo!')
      return
    }

    await $fetch(`${config.public.apiBase}/catalogue/combos/`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value),
    })

    toast.success('Tạo combo thành công!')
    router.push('/combo-management')
  } catch (error) {
    console.error('Lỗi khi tạo combo:', error)
    toast.error('Tạo combo thất bại!')
  }
}

const cancelCreate = () => {
  toast.warning(
    h('div', { class: 'space-y-2' }, [
      h('p', 'Bạn có chắc chắn muốn hủy không? Dữ liệu đã nhập sẽ bị mất.'),
      h(
        'button',
        {
          onClick: () => {
            toast.clear()
            router.push('/combo-management')
          },
          class: 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition',
        },
        'Hủy'
      ),
    ]),
    { timeout: false, closeOnClick: false }
  )
}
</script>

<style>
/* Hide number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>