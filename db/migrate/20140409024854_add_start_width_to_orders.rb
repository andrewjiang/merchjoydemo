class AddStartWidthToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :startW, :integer
  end
end
