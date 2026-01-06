class ProductsController < ApplicationController

  # Tutti i prodotti
  def index
    products = Product.all
    render json: products
  end

  # Prodotto specifico
  def show
    product = Product.find(params[:id])
    render json: product
  end
  
end

