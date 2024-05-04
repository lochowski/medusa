import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

import { LinkMethodRequest } from "@medusajs/types/src"
import { refetchStockLocation } from "../../helpers"
import { linkSalesChannelsToStockLocationWorkflow } from "@medusajs/core-flows"

export const POST = async (
  req: AuthenticatedMedusaRequest<LinkMethodRequest>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { add, remove } = req.validatedBody

  const workflow = linkSalesChannelsToStockLocationWorkflow(req.scope)
  const { errors } = await workflow.run({
    input: {
      id,
      add,
      remove,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const stockLocation = await refetchStockLocation(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ stock_location: stockLocation })
}
