<script setup lang="ts" scoped>
import { useLayoutStore } from '@store/layout'
import { onMounted } from 'vue'
import { useMapStore } from '@/store/map'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'
import { find, map } from 'lodash-es'
import { useLocalStore } from '@/store/localStorage'
import { useRscStore } from '@/store/rscStore'
import { setEncode } from '@/util'


const router = useRouter()
onMounted(async () => {
  useLayoutStore.isLoading = true
  useMapStore.selectMapId = -1
  localStorage.removeItem(useLocalStore['selectMapId'])

  const {ok,msg,data, tileData} = await window.api.connectDB()
  console.log('DB',{ok,msg,data})
  
  
  if(ok) {
    map(tileData,e=> useRscStore[e.sceneName].push(e) )
    useMapStore.totalMap = data.length
    useMapStore.totalMapData = data
  } else{ 
    useMapStore.totalMap = 0
    useMapStore.totalMapData = []
    toast.error(msg)
  }
  
  useLayoutStore.isLoading = false
})

const enterEditor =(idx: number)=>{
  useMapStore.selectMapId = idx
  const mapId = setEncode(`${idx}`,useLocalStore['selectMapId'])
  localStorage.setItem(useLocalStore['selectMapId'],mapId)

  const selectMap = find(useMapStore.totalMapData,(e)=> e.idx===useMapStore.selectMapId)
  if(selectMap) selectMap.tileData = JSON.parse(selectMap.tileData.replaceAll('`','"'))
  useMapStore.selectData = selectMap ? selectMap : {idx:-1,mapName:'',tileData:[]}
  useMapStore.mapJson = useMapStore.selectData ? useMapStore.selectData.tileData : useMapStore.mapInit

  router.push('editor')
}

const recreateDB =async ()=>{
  useLayoutStore.isLoading = true
  await window.api.recreateDB()
  useLayoutStore.isLoading = false
}

const deleteAllDB =async ()=>{
  useLayoutStore.isLoading = true
  await window.api.deleteAllDB()
  const {ok,msg,data} = await window.api.readDB()
  console.log(ok,msg)
  useMapStore.totalMapData = data
  useLayoutStore.isLoading = false
}


</script>

<template>
  <div>
    <div class="fixed top-0 left-0 w-screen h-60 flex justify-end items-center px-20 gap-20">
      <button 
        class="p-10 bg-emerald-900 text-white rounded-lg hover:bg-emerald-800"
        @click="enterEditor(-1)"
      >
        새로 만들기
      </button>

      <button 
        class="p-10 bg-emerald-900 text-white rounded-lg hover:bg-emerald-800"
        @click="recreateDB"
      >
        RECREATE DB TABLE
      </button>

      <button 
        class="p-10 bg-emerald-900 text-white rounded-lg hover:bg-emerald-800"
        @click="deleteAllDB"
      >
        DELETE ALL DATA
      </button>
    </div>
    <ul class="flex flex-wrap gap-20 text-white w-full h-full justify-center m-auto border-2 overflow-y-auto p-20">
      <p v-if="!useMapStore.totalMapData.length" class="text-white">비어 있음</p>

      <li v-for="(v,i) in useMapStore.totalMapData" :key="i" class="w-100 h-100 border-2 flex justify-center items-center gap-10 bg-gray-600"
      @click="enterEditor(v.idx)"
      >
      <p> {{ v.idx }} : </p>
      <p>{{ v.mapName }}</p>
      </li>
    </ul>
  </div>
</template>