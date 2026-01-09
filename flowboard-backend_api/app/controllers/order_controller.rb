class OrderController < ApplicationController
  before_action :authenticate_user!

  def create
    cart = current_user.cart
    return render json: { error: "Carrello vuoto" }, status: :unprocessable_entity if cart.cart_items.empty?

    order_params = params.require(:order).permit(:name, :surname, :email, :address, :cap, :city)

    order = current_user.orders.create!(status: "pending", total: 0, **order_params)

    cart.cart_items.each do |item|
      order.order_items.create!(
        product: item.product,
        quantity: item.quantity,
        unit_price: item.unit_price
      )
    end

    order.update!(total: order.order_items.sum { |i| i.quantity * i.unit_price })

    cart.cart_items.destroy_all

    render json: order, include: { order_items: { include: :product } }, status: :created
  end

  def show
    order = current_user.orders.find(params[:id])
    render json: order, include: { order_items: { include: :product } }
  end

  def index
    orders = current_user.orders.includes(order_items: :product)
    render json: orders, include: { order_items: { include: :product } }
  end
end
