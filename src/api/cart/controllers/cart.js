"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::cart.cart", ({ strapi }) => ({
  // Custom addToCart method
  async addToCart(ctx) {
    const { email, productId } = ctx.request.body;

    if (!email || !productId) {
      return ctx.badRequest("Email and productId are required.");
    }

    try {
      // Fetch the cart for the user
      const [existingCart] = await strapi.entityService.findMany(
        "api::cart.cart",
        {
          filters: { userEmail: email },
        }
      );

      if (existingCart) {
        // Check if the product already exists in the cart
        const existingItemIndex = existingCart.items.findIndex(
          (item) => item.product === productId
        );

        if (existingItemIndex >= 0) {
          // Increment quantity if product exists
          existingCart.items[existingItemIndex].quantity += 1;
        } else {
          // Add the product to the cart
          existingCart.items.push({ product: productId, quantity: 1 });
        }

        // Update the cart
        const updatedCart = await strapi.entityService.update(
          "api::cart.cart",
          existingCart.id,
          {
            data: { items: existingCart.items },
          }
        );

        return ctx.send({
          message: "Cart updated successfully",
          cart: updatedCart,
        });
      } else {
        // Create a new cart for the user
        const newCart = await strapi.entityService.create("api::cart.cart", {
          data: {
            userEmail: email,
            items: [{ product: productId, quantity: 1 }],
          },
        });

        return ctx.send({
          message: "New cart created and item added",
          cart: newCart,
        });
      }
    } catch (error) {
      console.error(error);
      return ctx.badRequest("Failed to add item to cart.");
    }
  },

  // Custom getCart method
  async getCart(ctx) {
    const { email } = ctx.params;

    if (!email) {
      return ctx.badRequest("Email is required.");
    }

    try {
      const [cart] = await strapi.entityService.findMany("api::cart.cart", {
        filters: { userEmail: email },
      });

      if (cart) {
        return ctx.send(cart);
      } else {
        return ctx.notFound("Cart not found.");
      }
    } catch (error) {
      console.error(error);
      return ctx.badRequest("Failed to fetch cart.");
    }
  },

  // Custom removeItemFromCart method
  async removeItemFromCart(ctx) {
    const { email, productId } = ctx.query; // Extract email and productId from query parameters

    // Validate that email and productId are provided
    if (!email || !productId) {
      return ctx.badRequest("Email and productId are required.");
    }

    try {
      // Find the cart for the given email
      const cart = await strapi.entityService.findMany("api::cart.cart", {
        filters: { userEmail: email },
      });

      if (cart.length > 0) {
        const updatedItems = cart[0].items.filter(
          (item) => item.product !== productId
        );
        console.log(updatedItems);

        // Update the cart with filtered items
        await strapi.entityService.update("api::cart.cart", cart[0].id, {
          data: { items: updatedItems },
        });

        return ctx.send({ message: "Item removed from cart successfully" });
      } else {
        return ctx.send({ message: "Cart not found." }, 404);
      }
    } catch (error) {
      console.error(error);
      return ctx.badRequest("Failed to remove item from cart.");
    }
  },
  async updateItemQuantity(ctx) {
    const { email, productId, quantity } = ctx.request.body;

    // Validate that all required fields are provided
    if (!email || !productId || quantity === undefined) {
      return ctx.badRequest("Email, productId, and quantity are required.");
    }

    try {
      // Find the cart for the given email
      const cart = await strapi.entityService.findMany("api::cart.cart", {
        filters: { userEmail: email },
      });

      if (cart.length > 0) {
        const existingCart = cart[0];
        const existingItem = existingCart.items.find(
          (item) => item.product === productId
        );

        console.log(existingItem);

        if (existingItem) {
          if (quantity > 0) {
            // Update the item's quantity
            existingItem.quantity = quantity;
          } else {
            // If quantity is 0 or less, remove the item from the cart
            existingCart.items = existingCart.items.filter(
              (item) => item.product !== parseInt(productId, 10)
            );
          }

          // Update the cart with modified items
          await strapi.entityService.update("api::cart.cart", existingCart.id, {
            data: { items: existingCart.items },
          });

          return ctx.send({
            message:
              quantity > 0 ? "Item quantity updated" : "Item removed from cart",
            cart: existingCart,
          });
        } else {
          return ctx.badRequest("Item not found in cart.");
        }
      } else {
        return ctx.badRequest("Cart not found.");
      }
    } catch (error) {
      console.error(error);
      return ctx.badRequest("Failed to update item quantity.");
    }
  },
}));
