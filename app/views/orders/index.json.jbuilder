json.array!(@orders) do |order|
  json.extract! order, :user, :quantity, :canvas, :model
  json.url order_url(order, format: :json)
end