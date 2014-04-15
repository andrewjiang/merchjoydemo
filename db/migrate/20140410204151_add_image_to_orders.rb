class AddImageToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :image, :text
  end
end
