class WishlistItemsController < ApplicationController
  before_action :authenticate_user! #HTTP 401

def index
  items = current_user.wishlist_items.includes(:product)
  render json: items.as_json(include: :product)
end

def create
  item = current_user.wishlist_items.build(product_id: params[:product_id])
  if item.save
    render json: item.as_json(include: :product), status: :created
  else
    render json: { error: 'Già presente in wishlist' }, status: :unprocessable_entity # HTTP 422
  end
end


  # DELETE /wishlist/:product_id
def destroy
  product_id = params[:id]
  item = current_user.wishlist_items.find_by(product_id: product_id)

  if item
    item.destroy
    # restituisce la wishlist aggiornata con tutti i prodotti inclusi
    items = current_user.wishlist_items.includes(:product)
    render json: items.as_json(include: :product)
  else
    render json: { error: 'Item non trovato' }, status: :not_found # HTTP 404
  end
end

end
