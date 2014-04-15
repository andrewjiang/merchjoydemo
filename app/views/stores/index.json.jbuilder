json.array!(@stores) do |store|
  json.extract! store, :name, :title, :logo
  json.url store_url(store, format: :json)
end