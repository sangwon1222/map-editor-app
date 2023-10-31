<script setup lang="ts" scoped>
import { useLayoutStore } from '@store/layout'
import { canvasInfo } from '@/util/config'
import { onMounted, reactive, ref } from 'vue'
import { resize, setDecode, setEncode } from '@/util'
import App from '@app/app'
import MapEditor from '@/app/scene/mapEditor/mapEditor'
import { find, isNil, update } from 'lodash-es'
import { useMapStore } from '@/store/map'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useLocalStore } from '@/store/localStorage'
const router = useRouter()

const refMapNameInput = ref(null)
const state = reactive({
  openMapNameInput: false,
  mapName: '',
  rscImgPreview: {}
})
onMounted(async () => {
  useLayoutStore.isLoading = true

  const canvasElement = document.getElementById('pixi-canvas') as HTMLCanvasElement
  const { backgroundColor, width, height } = canvasInfo
  window['app'] = new App({ backgroundColor, width, height, view: canvasElement })
  await window['app'].init()
  resize(canvasElement)

  window.addEventListener('resize', () => resize(canvasElement))
  useLayoutStore.isLoading = false
})

const inputMapName =(e: KeyboardEvent)=>{
  state.mapName = (e.currentTarget as HTMLInputElement).value
}
const openInputMapName =  () => {
  state.openMapNameInput = true
  useLayoutStore.isLoading = true
  state.mapName = useMapStore.selectData.mapName
  setTimeout(
    ()=>{
      refMapNameInput.value.value = state.mapName
      refMapNameInput.value.select()
      useLayoutStore.isLoading = false
    },
    500
  )
}
const closeInputMapName =  () => {
  state.openMapNameInput = false
  state.mapName = ''
}

const saveMap = async () => {
  const mapData = (App.getHandle.getScene as MapEditor).saveMapData()
  
  if(!isNil(mapData)&& state.mapName) {
    refMapNameInput.value?.blur()
    const isDuplicateData = find(useMapStore.totalMapData,e=>e.mapName===state.mapName)
    const tileData = JSON.stringify(mapData)

    useLayoutStore.isLoading = true

    if( isDuplicateData  ){
      if(confirm('같은 이름의 파일이 있습니다. 덮어씌우겠습니까?')){
        const update = await window.api.updateDB(isDuplicateData.idx,tileData)
        if(update.ok) toast.success(`${update.msg}, [ ${state.mapName} ] 수정`)
        else toast.error(update.msg)
      }
    }
    if(!isDuplicateData){
      const insert = await window.api.insertDB(tileData,state.mapName)
      if(insert.ok) toast.success(`데이터 [ ${state.mapName} ] 추가`)
      else toast.error(insert.msg)
    }

    const {ok,data} = await window.api.readDB()
    if(ok) {
      useMapStore.totalMapData = data
    }
    else toast.error('데이터 동기화 실패')
    // if(ok) await window.api.sendGmail(JSON.stringify(data))
    state.openMapNameInput = false
    useLayoutStore.isLoading = false
  }
}

const showPreview=(e)=>{
  const target =  e.currentTarget as HTMLInputElement;
  const targetFilesArray = Array.from(target.files);
  targetFilesArray.map((file) => {
    console.log(file)
    // state.rscImgPreview[file.name] = URL.createObjectURL(file)
    state.rscImgPreview[file.name] = file.path
    });
}

const submitImg=async ()=>{
  if( Object.keys(state.rscImgPreview).length < 1) return
  
  useLayoutStore.isLoading = true

  console.log(state.rscImgPreview)
  const upload =await window.api.updateRsc(JSON.stringify(state.rscImgPreview),'map-editor')
  console.log(upload)
  useLayoutStore.isLoading = false
}

const goHome =()=> router.push('/')

</script>

<template>
  <div class="relative flex w-full h-full items-center justify-center bg-black">
    <ul class="fixed top-0 left-0 flex gap-10 bg-white bg-opacity-50">
      <li v-for="(v,i) in state.rscImgPreview" class="relative">
        <p class="absolute top-0 text-white"> {{ i }}</p> 
        <img :src="v" :alt="v" class="w-auto h-full">
      </li>
    </ul>

    <div class="fixed left-0 bottom-10 flex w-full h-100 justify-between z-20">
      <div class="flex flex-col text-12">
        <p>ctrl + mouse move: Item Placement</p>
        <p>alt + drag : Map Move</p>
        <p>wheel : Map Scale</p>
      </div>

      <div class="flex gap-20 px-10">
        
        
        <div class="flex-col gap-10 h-full" >
          <input type="file" multiple accept="image/png" @change=showPreview class="border-2 border-red-800"/>
          <button class="btn" @click="submitImg">이미지 업로드</button>
        </div>

        <button class="btn" @click="openInputMapName">저장</button>

        <button class="btn" @click="goHome">목록</button>
      </div>
    </div>
    
    <div 
        class="fixed w-screen h-screen bg-black flex justify-center items-center z-30"
        v-if="state.openMapNameInput"
      >
      <div class=" flex flex-col gap-20 border-2 p-40 rounded bg-gray-700" v-click-outside="closeInputMapName">
          <div class="flex gap-10 items-center">
            <p>맵 이름: </p>
            <input id="map-name" tabindex="0" type="text" class="p-10" @input="inputMapName" ref="refMapNameInput" >
          </div>
          <button 
            class="rounded border-2 border-white bg-white bg-opacity-50 text-black px-20 py-10 duration-500 hover:bg-gray-700 hover:text-white" 
            @click="saveMap"
          >
            저장
          </button>
        </div>
      </div>

    <canvas id="pixi-canvas" class="relative z-10"/>
  </div>
</template>

<style lang="less" scoped>
.btn{
  @apply flex items-center justify-center rounded border-2 border-white bg-white bg-opacity-50 text-black px-20 py-10 duration-500 hover:bg-gray-700 hover:text-white;
}
</style>