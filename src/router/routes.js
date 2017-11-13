export default [
  {
    path: '/',
    name: 'HelloWorld',
    component: resolve => require(['@/pages/HelloWorld'], resolve)
  },
  {
    path: '/example',
    name: 'Example',
    component: resolve => require(['@/pages/example/Example'], resolve)
  }
]
