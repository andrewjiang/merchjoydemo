json.array!(@carts) do |cart|
  json.extract! cart, :user, :session, :total
  json.url cart_url(cart, format: :json)
end