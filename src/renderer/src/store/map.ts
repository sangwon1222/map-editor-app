import { reactive } from 'vue';

export const useMapStore: TypeMapStore = reactive({
  mapInit: [[], [], [], [], [], [], [], [], [], [], [], [], [], []],
  mapJson: [[], [], [], [], [], [], [], [], [], [], [], [], [], []],
  totalMap:0,
  totalMapData:[],
  selectMapId: -1,
  selectData: {
    idx:-1,
    mapName: '',
    tileData:[[], [], [], [], [], [], [], [], [], [], [], [], [], []],
  }
});
