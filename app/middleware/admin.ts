export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  if (to.path === '/admin/login') {
    if (auth.loggedIn) return navigateTo('/admin')
    return
  }
  if (!auth.loggedIn) return navigateTo('/admin/login')
})
