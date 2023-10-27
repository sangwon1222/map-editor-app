<script setup lang="ts" scoped>
import TLoading from '@template/tLoading.vue';
import { useLayoutStore } from '@store/layout';
import { onMounted } from 'vue';
import { setDecode } from './util';
import { useLocalStore } from './store/localStorage';
import { useMapStore } from './store/map';
import { find } from 'lodash-es';
import { useRouter } from 'vue-router';
const router = useRouter()

onMounted(()=> {
  const encodedSelectMapId = localStorage.getItem(useLocalStore['selectMapId'])

  const selectMapId = setDecode(encodedSelectMapId,useLocalStore['selectMapId'])
  if(!selectMapId) return

  useMapStore.selectMapId = +selectMapId

  const selectMap = find(useMapStore.totalMapData,(e)=> e.idx===useMapStore.selectMapId)
  if(selectMap) {
    useMapStore.selectData = selectMap ? selectMap : {idx:-1,mapName:'',tileData:[]}
    useMapStore.mapJson = useMapStore.selectData ? useMapStore.selectData.tileData : useMapStore.mapInit
    router.push('editor')
  }

})

</script>

<template>
  <div class="relative flex w-full h-full items-center justify-center bg-black">
    <t-loading v-if="useLayoutStore.isLoading"/>
    <div>
      <router-view />
    </div>
  </div>
</template>
