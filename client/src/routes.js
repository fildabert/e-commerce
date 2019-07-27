import ProductsDisplay from "./views/products-display.vue"
import ModifyProducts from "./views/modify-products.vue"
import ShoppingCart from "./components/shopping-cart.vue"
import TransactionHistory from "./components/transaction-history.vue"
import AddProduct from "./views/add-product.vue"
import EditProducts from "./views/edit-product.vue"
import ProductDetails from "./components/product-details.vue"
import TransactionsAdmin from "./views/transaction-admin.vue"

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
    { path: "/admin/transactions", component: TransactionsAdmin},
    { path: "/products/add", component: AddProduct}
]

export default routes;