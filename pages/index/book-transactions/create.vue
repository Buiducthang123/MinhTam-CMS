<template>
  <div class="px-6 py-10">
    <div class="text-xl font-medium mb-6 flex items-center cursor-pointer" @click="navigateTo('/book-transactions')">
      <Icon name="i-material-symbols-arrow-back-ios"></Icon>
      <span> Quay lại trang quản lý xuất nhập</span>
    </div>
    <h3 class="font-bold text-xl mb-6">Tạo mới xuất nhập sách</h3>
    <a-form :model="formCreate" :rules="rules" ref="formRef" layout="vertical" @finish="handleCreate">
      <a-form-item label="Sách" name="book_id" required>
        <a-select v-model:value="formCreate.book_id" 
          show-search
          placeholder="Chọn sách" :field-names="{ label: 'title', value: 'id'}" :options="books??[]"
          :filter-option="(input, option) => option?.title?.toLowerCase().indexOf(input.toLowerCase()) >= 0"
          />
      </a-form-item>

      <a-form-item label="Số lượng" name="quantity" required>
        <a-input-number v-model:value="formCreate.quantity" min="1" class="w-48"/>
      </a-form-item>

      <a-form-item label="Giá" name="price" required>
        <a-input-number v-model:value="formCreate.price" class="w-48" :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
      </a-form-item>

      <a-form-item label="Ghi chú" name="note">
        <a-textarea v-model:value="formCreate.note" :rows="4" />
      </a-form-item>

      <a-form-item label="Ngày giao dịch" name="date" required>
        <a-date-picker v-model:value="formCreate.date" placeholder="" value-format="YYYY-MM-DD" format="DD/MM/YYYY"/>
      </a-form-item>

      <a-form-item label="Trạng thái" name="status" required>
        <a-select v-model:value="formCreate.status" placeholder="Chọn trạng thái">
          <a-select-option v-for="option in statusOptions" :key="option.key" :value="option.key">{{ option.value }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Loại giao dịch" name="type" required>
        <a-select v-model:value="formCreate.type" placeholder="Chọn loại giao dịch">
          <a-select-option v-for="option in typeOptions" :key="option.key" :value="option.key">{{ option.value }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">Tạo mới</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import type { IBook } from '~/interfaces/book';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { BookTransactionStatus, BookTransactionStatusText, BookTransactionType, BookTransactionTypeText } from '~/enums/bookTransaction.enum';
import type { Rule } from 'ant-design-vue/es/form';

dayjs.extend(utc);
dayjs.extend(timezone);

const authStore = useAuthStore();
const accessToken = computed(() => authStore.accessToken);
const router = useRouter();

const { data: books } = await useFetch<IBook[]>('api/books', {
  baseURL: useRuntimeConfig().public.baseURLAPI,
  headers: {
    Authorization: `Bearer ${accessToken.value}`
  }
});

const formCreate = reactive({
  book_id: undefined,
  user_id: undefined,
  quantity: 1,
  status: undefined,
  type: undefined,
  price: 0,
  note: '',
  date: dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD')
});

const formRef = ref();

const rules: Record<string,Rule[]> = {
  book_id: [{ required: true, message: 'Vui lòng chọn sách', trigger: 'change' }],
  quantity: [{ required: true, message: 'Vui lòng nhập số lượng', trigger: 'blur' }],
  price: [{ required: true, message: 'Vui lòng nhập giá', trigger: 'blur' }],
  date: [{ required: true, message: 'Vui lòng chọn ngày giao dịch', trigger: 'change' }],
  status: [{ required: true, message: 'Vui lòng chọn trạng thái', trigger: 'change' }],
  type: [{ required: true, message: 'Vui lòng chọn loại giao dịch', trigger: 'change' }]
};

const handleCreate = async () => {
  await formRef.value.validate();
  await $fetch('/api/book-transactions', {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    method: 'post',
    headers: {
      Authorization: `Bearer ${accessToken.value}`
    },
    body: formCreate,
    onResponse: ({ response })=>{
        if(response.ok){
            message.success('Tạo mới giao dịch thành công');
            router.push('/book-transactions');
        }else{
            message.error('Tạo mới giao dịch thất bại');
        }
    }
  });

};


const statusOptions =  Object.entries(BookTransactionStatusText).map(
  ([key, value]) => ({ key, value })
);

const typeOptions = Object.entries(BookTransactionTypeText).map(
  ([key, value]) => ({ key, value })
);

</script>

<style scoped></style>