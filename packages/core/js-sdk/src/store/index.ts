import { Client } from "../client"

export class Store {
  private client: Client

  constructor(client: Client) {
    this.client = client
  }

  public region = {
    list: async (
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/regions`, { query: queryParams, headers })
        .then((resp) => resp.json())
    },
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/regions/${id}`, { query: queryParams, headers })
        .then((resp) => resp.json())
    },
  }

  public collection = {
    list: async (
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/collections`, { query: queryParams, headers })
        .then((resp) => resp.json())
    },
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/collections/${id}`, { query: queryParams, headers })
        .then((resp) => resp.json())
    },
  }

  public category = {
    list: async (
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/product-categories`, { query: queryParams, headers })
        .then((resp) => resp.json())
    },
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/product-categories/${id}`, {
          query: queryParams,
          headers,
        })
        .then((resp) => resp.json())
    },
  }

  public product = {
    list: async (
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/products`, { query: queryParams, headers })
        .then((resp) => resp.json())
    },
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/products/${id}`, {
          query: queryParams,
          headers,
        })
        .then((resp) => resp.json())
    },
  }

  public order = {
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/orders/${id}`, {
          query: queryParams,
          headers,
        })
        .then((resp) => resp.json())
    },
  }

  public cart = {
    create: async (body: any, headers?: Record<string, any>) => {
      return this.client
        .fetch(`/store/carts`, {
          headers,
          method: "POST",
          body: JSON.stringify(body),
        })
        .then((resp) => resp.json())
    },
    update: async (id: string, body: any, headers?: Record<string, any>) => {
      return this.client
        .fetch(`/store/carts/${id}`, {
          headers,
          method: "POST",
          body: JSON.stringify(body),
        })
        .then((resp) => resp.json())
    },
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/carts/${id}`, {
          query: queryParams,
          headers,
        })
        .then((resp) => resp.json())
    },
    createLineItem: async (
      cartId: string,
      body: any,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/carts/${cartId}/line-items`, {
          headers,
          method: "POST",
          body: JSON.stringify(body),
        })
        .then((resp) => resp.json())
    },
    updateLineItem: async (
      cartId: string,
      lineItemId: string,
      body: any,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/carts/${cartId}/line-items/${lineItemId}`, {
          headers,
          method: "POST",
          body: JSON.stringify(body),
        })
        .then((resp) => resp.json())
    },
    deleteLineItem: async (
      cartId: string,
      lineItemId: string,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/carts/${cartId}/line-items/${lineItemId}`, {
          headers,
          method: "DELETE",
        })
        .then((resp) => resp.json())
    },
    addShippingMethod: async (
      cartId: string,
      body: any,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/carts/${cartId}/shipping-methods`, {
          headers,
          method: "POST",
          body: JSON.stringify(body),
        })
        .then((resp) => resp.json())
    },
    complete: async (cartId: string, headers?: Record<string, any>) => {
      return this.client
        .fetch(`/store/carts/${cartId}/complete`, {
          headers,
          method: "POST",
        })
        .then((resp) => resp.json())
    },
  }

  public fulfillment = {
    listCartOptions: async (
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/shipping-options`, {
          query: queryParams,
          headers,
        })
        .then((resp) => resp.json())
    },
  }

  public payment = {
    listPaymentProviders: async (
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/payment-providers`, {
          query: queryParams,
          headers,
        })
        .then((resp) => resp.json())
    },

    initiatePaymentSession: async (
      cart: any,
      body: any,
      headers?: Record<string, any>
    ) => {
      let paymentCollectionId = (cart as any).payment_collection?.id
      if (!paymentCollectionId) {
        const collectionBody = {
          cart_id: cart.id,
          region_id: cart.region_id,
          currency_code: cart.currency_code,
          amount: cart.total,
        }
        paymentCollectionId = (
          await this.client
            .fetch(`/store/payment-collections`, {
              headers,
              method: "POST",
              body: JSON.stringify(collectionBody),
            })
            .then((resp) => resp.json())
        ).payment_collection.id
      }

      return this.client
        .fetch(
          `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
          {
            headers,
            method: "POST",
            body: JSON.stringify(body),
          }
        )
        .then((resp) => resp.json())
    },
  }
}
