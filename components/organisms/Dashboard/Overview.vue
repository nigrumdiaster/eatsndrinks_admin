<script setup lang="ts">
import { BarChart } from '@/components/ui/chart-bar'
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'

const data = ref([])
const config = useRuntimeConfig()
const token = useCookie('access_token')

const fetchYearlyRevenue = async () => {
  try {
    if (!token.value) return
    const response = await $fetch(`${config.public.apiBase}/order/admin/yearly-revenue/`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    data.value = response.map(item => ({
      name: item.month,
      total: item.revenue
    }))
  } catch (error) {
    console.error('Error fetching yearly revenue:', error)
  }
}

onMounted(() => {
  fetchYearlyRevenue()
})
</script>

<template>
  <BarChart :data="data" :categories="['total']" :index="'name'" :rounded-corners="4" />
</template>