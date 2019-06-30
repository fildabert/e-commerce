import ProductsDisplay from "./components/products-display.vue"
import ModifyProducts from "./components/modify-products.vue"
import ShoppingCart from "./components/shopping-cart.vue"
import TransactionHistory from "./components/transaction-history.vue"
import AddProduct from "./components/add-product.vue"
import EditProducts from "./components/edit-product.vue"
import ProductDetails from "./components/product-details.vue"

const routes = [
    { path: "/products", component: ProductsDisplay,
      children: [
          {
              path: "details",
              component: ProductDetails
          }
      ] },
    { path: "/cart", component: ShoppingCart },
    { path: "/history", component: TransactionHistory },
    { path: "/admin/modify", component: ModifyProducts, 
      children:[
            {
                path: "edit",
                component: EditProducts
            }
    ]},
    { path: "/products/add", component: AddProduct}
]

export default routes;