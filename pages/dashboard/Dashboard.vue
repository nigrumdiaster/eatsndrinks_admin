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
      <div class="flex-col md:flex"> <!-- ĐÃ SỬA: Bỏ lớp 'hidden' -->
        <div class="flex-1 space-y-4 p-8 pt-6">
          <div class="flex items-center justify-between space-y-2">
            <h2 class="text-3xl font-bold tracking-tight">
              Dashboard
            </h2>
          </div>
          <Tabs default-value="overview" class="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">
                Tổng quan
              </TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Phân tích
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Báo cáo
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" class="space-y-4">
              <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">
                      Tổng doanh thu
                    </CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      class="h-4 w-4 text-muted-foreground">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold">
                      $45,231.89
                    </div>
                    <p class="text-xs text-muted-foreground">
                      +20.1% so với tháng trước
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">
                      Đăng ký
                    </CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      class="h-4 w-4 text-muted-foreground">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold">
                      +12
                    </div>
                    <p class="text-xs text-muted-foreground">
                      +180.1% so với tháng trước
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">
                      Hàng hoá
                    </CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      class="h-4 w-4 text-muted-foreground">
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold">
                      +12
                    </div>
                    <p class="text-xs text-muted-foreground">
                      +19% so với tháng trước
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">
                      Đang giảm giá
                    </CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      class="h-4 w-4 text-muted-foreground">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold">
                      +12
                    </div>
                    <p class="text-xs text-muted-foreground">
                      +12 so với hôm qua
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card class="col-span-4">
                  <CardHeader>
                    <CardTitle>Tổng quan</CardTitle>
                  </CardHeader>
                  <CardContent class="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card class="col-span-3">
                  <CardHeader>
                    <CardTitle>Bán gần đây</CardTitle>
                    <CardDescription>
                      Bạn đã bán 34 sản phẩm tháng này.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
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

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import Overview from '~/components/organisms/Dashboard/Overview.vue'
import RecentSales from '~/components/organisms/Dashboard/RecentSales.vue'
</script>