import after from "medusa-admin:widgets/product_category/list/after"
import before from "medusa-admin:widgets/product_category/list/before"
import { Outlet } from "react-router-dom"
import { CategoryListTable } from "./components/category-list-table"

export const CategoryList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <CategoryListTable />
      <Outlet />
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
    </div>
  )
}