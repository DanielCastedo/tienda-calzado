import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { AboutPage, LandingPage, LoginPage, NotFoundPage, OrdersPage, ProductsPage } from '@/pages'
import { AppLayout } from './AppLayout'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: ROUTES.HOME, element: <LandingPage /> },
      { path: ROUTES.ABOUT, element: <AboutPage /> },
      { path: ROUTES.PRODUCTS, element: <ProductsPage /> },
      { path: ROUTES.ORDERS, element: <OrdersPage /> },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
