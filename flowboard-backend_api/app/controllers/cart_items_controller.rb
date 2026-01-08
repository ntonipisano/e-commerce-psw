class CartItemsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_cart

  def create
    product = Product.find(params[:product_id])
    item = @cart.cart_items.find_or_initialize_by(product: product)
    item.quantity = (item.quantity || 0) + params[:quantity].to_i
    item.unit_price = product.price
    item.save!
    render json: @cart, include: :cart_items
  end

  def update
    item = @cart.cart_items.find(params[:id])
    item.update!(quantity: params[:quantity])
    render json: @cart, include: :cart_items
  end

  def destroy
    item = @cart.cart_items.find(params[:id])
    item.destroy
    render json: @cart, include: :cart_items
  end

  private

  def set_cart
    @cart = current_user.cart || current_user.create_cart
  end
end
