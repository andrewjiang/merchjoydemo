class AddCartToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :cart, :string
  end
end
