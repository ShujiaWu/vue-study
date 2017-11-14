export default [
  {
    path: '/',
    redirect: '/example'
  },
  {
    path: '/example',
    name: 'Example',
    component: resolve => require(['@/pages/example/Example'], resolve)
  },
  {
    path: '/mobile-image-upload-example',
    name: 'MobileImageUploadExample',
    component: resolve => require(['@/pages/example/mobile-image-file-upload/MobileImageFileUpload'], resolve)
  }
]
