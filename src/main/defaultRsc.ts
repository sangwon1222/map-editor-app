/**
 * default 이미지 리스트 만들고 데이터가 없을때, default 리소스만 로드 받아서 쓰려고 했는데,
 * DBbase.ts에서 리소스 파일에 있는 이미지 이름을 전부 가져와서 넣어주는게 더 좋을것 같다.
 * => 업로드가 된 이미지인데 유저한테 안보일 수 있음.
 * => 이 파일은 지금 안쓰는 파일
 */

export const defaultRscList = [
    {idx: 1, tileName: 'black-wall-tile-100.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 2, tileName: 'black-wall-tile-200.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 3, tileName: 'black-wall-tile-50.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 4, tileName: 'black-wall-tile-b-l-50.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 5, tileName: 'black-wall-tile-b-r-50.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 6, tileName: 'black-wall-tile-t-l-50.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 7, tileName: 'black-wall-tile-t-r-50.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 8, tileName: 'cube-fire-1.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 9, tileName: 'cube-ice-1.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 10, tileName: 'cube-lava-1.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 11, tileName: 'cube-plant-1.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 12, tileName: 'cube-stone-1.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 13, tileName: 'cube-water-1.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 14, tileName: 'cube-wood-1.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 15, tileName: 'floor-1.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 16, tileName: 'test-tile-2.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 17, tileName: 'wall-tile-100.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 18, tileName: 'wall-tile-200.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 19, tileName: 'wall-tile-50.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 20, tileName: 'wall-tile-b-l-50.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 21, tileName: 'wall-tile-b-r-50.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 22, tileName: 'wall-tile-t-l-50.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 23, tileName: 'wall-tile-t-r-50.png', sceneName: 'map-editor', zIndex: '0'},
    {idx: 24, tileName: 'chevron.png', sceneName: 'common', zIndex: '0'},
    {idx: 25, tileName: 'edit-tool-bg.png', sceneName: 'common', zIndex: '0'},
    {idx: 26, tileName: 'pos-icon.png', sceneName: 'common', zIndex: '0'}
]