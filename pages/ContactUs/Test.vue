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
    <div class="h -full w- full flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="hidden flex-col md:flex">
        <Mail :accounts="accounts" :mails="mails" :nav-collapsed-size="4" />
      </div>
    </div>
  </MainTemplate>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig, useCookie } from '#app'
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
import Mail from '~/components/organisms/mail/Mail.vue'
import { accounts, mails } from '~/data/mails'

</script>
