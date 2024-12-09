<template>
  <div class="px-6 py-10">
    <div class="text-xl font-medium mb-6 flex items-center cursor-pointer" @click="navigateTo('/book-transactions')">
      <Icon name="i-material-symbols-arrow-back-ios"></Icon>
      <span> Quay lại trang quản lý xuất nhập</span>
    </div>
    <h3 class="font-bold text-xl mb-6">Chỉnh sửa xuất nhập sách</h3>
    <a-form :model="formUpdate" :rules="rules" ref="formRef" layout="vertical" @finish="handleUpdate">
      {{ formUpdate.date ? dayjs(formUpdate.date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : '' }}

      <a-form-item label="Sách" name="book_id" required>
        <a-select v-model:value="formUpdate.book_id" 
          show-search
          placeholder="Chọn sách" :field-names="{ label: 'title', value: 'id'}" :options="books??[]"
          :filter-option="(input, option) => option?.title?.toLowerCase().indexOf(input.toLowerCase()) >= 0"
          />
      </a-form-item>

      <a-form-item label="Số lượng" name="quantity" required>
        <a-input-number v-model:value="formUpdate.quantity" min="1" class="w-48"/>
      </a-form-item>

      <a-form-item label="Giá" name="price" required>
        <a-input-number v-model:value="formUpdate.price" class="w-48" :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
      </a-form-item>

      <a-form-item label="Ghi chú" name="note">
        <a-textarea v-model:value="formUpdate.note" :rows="4" />
      </a-form-item>

      <a-form-item label="Ngày giao dịch" name="date" required>
        <a-date-picker v-model:value="formUpdate.date" placeholder="" value-format="YYYY-MM-DD" format="DD/MM/YYYY"/>
      </a-form-item>

      <a-form-item label="Trạng thái" name="status" required>
        <a-select v-model:value="formUpdate.status" placeholder="Chọn trạng thái">
          <a-select-option v-for="option in statusOptions" :key="option.key" :value="option.key">{{ option.value }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Loại giao dịch" name="type" required>
        <a-select v-model:value="formUpdate.type" placeholder="Chọn loại giao dịch">
          <a-select-option v-for="option in typeOptions" :key="option.key" :value="option.key">{{ option.value }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">Lưu lại</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import type { IBook } from '~/interfaces/book';
import type { IBookTransaction } from '~/interfaces/bookTransactions';
import type { IResponsePagination } from '~/interfaces/response';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { BookTransactionStatusText, BookTransactionTypeText } from '~/enums/bookTransaction.enum';
import type { Rule } from 'ant-design-vue/es/form';

dayjs.extend(utc);
dayjs.extend(timezone);

const authStore = useAuthStore();
const accessToken = computed(() => authStore.accessToken);
const route = useRoute();
const router = useRouter();

const query = {
  'with[]': ['book']
};

const { data: bookTransaction } = await useFetch<IBookTransaction>('api/book-transactions/' + route.params.id, {
  baseURL: useRuntimeConfig().public.baseURLAPI,
  headers: {
    Authorization: `Bearer ${accessToken.value}`
  },
  query
});

const { data: books } = await useFetch<IBook[]>('api/books', {
  baseURL: useRuntimeConfig().public.baseURLAPI,
  headers: {
    Authorization: `Bearer ${accessToken.value}`
  }
});

const formUpdate = reactive({
  book_id: bookTransaction.value?.book_id,
  user_id: bookTransaction.value?.user_id,
  quantity: bookTransaction.value?.quantity,
  status: bookTransaction.value?.status,
  type: bookTransaction.value?.type,
  price: bookTransaction.value?.price,
  note: bookTransaction.value?.note,
  date: bookTransaction.value ? dayjs(bookTransaction.value.date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD') : ''
});

const formRef = ref();

const rules: Record<string, Rule[]> = {
  book_id: [{ required: true, message: 'Vui lòng chọn sách', trigger: 'change' }],
  quantity: [{ required: true, message: 'Vui lòng nhập số lượng', trigger: 'blur' }],
  price: [{ required: true, message: 'Vui lòng nhập giá', trigger: 'blur' }],
  date: [{ required: true, message: 'Vui lòng chọn ngày giao dịch', trigger: 'change' }],
  status: [{ required: true, message: 'Vui lòng chọn trạng thái', trigger: 'change' }],
  type: [{ required: true, message: 'Vui lòng chọn loại giao dịch', trigger: 'change' }]
};

const handleUpdate = async () => {
  await formRef.value.validate();
  await $fetch('/api/book-transactions/' + bookTransaction.value?.id, {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    method: 'patch',
    headers: {
      Authorization: `Bearer ${accessToken.value}`
    },
    body: formUpdate
  });
  router.push('/book-transactions');
};


const statusOptions =  Object.entries(BookTransactionStatusText).map(
  ([key, value]) => ({ key, value })
);

const typeOptions = Object.entries(BookTransactionTypeText).map(
  ([key, value]) => ({ key, value })
);

</script>

<style scoped></style>