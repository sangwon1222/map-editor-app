import { reactive } from 'vue';

export const useLocalStore: TypeLocalStore = reactive({
  selectMapId: 'smi',
  selectData: 'sd'
});
