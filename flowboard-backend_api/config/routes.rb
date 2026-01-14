Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  post   '/auth/login',  to: 'auth#login'
  post   '/auth/register', to: 'auth#register'
  post   '/auth/logout', to: 'auth#logout'
  get    '/auth/me',     to: 'auth#me'
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # altrimenti: resources :products, only: [:index, :show]
  get '/products',     to: 'products#index'
  get '/products/:id', to: 'products#show'

  get    '/cart',        to: 'cart#show'
  post   '/cart/items',  to: 'cart_items#create'
  patch  '/cart/items/:id', to: 'cart_items#update'
  delete '/cart/items/:id', to: 'cart_items#destroy'

  post '/orders',      to: 'order#create'
  get  '/orders',      to: 'order#index'
  get  '/orders/:id',  to: 'order#show'

  get   '/wishlist',       to: 'wishlist_items#index'
  post  '/wishlist',       to: 'wishlist_items#create'
  delete '/wishlist/:id',      to: 'wishlist_items#destroy'

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
