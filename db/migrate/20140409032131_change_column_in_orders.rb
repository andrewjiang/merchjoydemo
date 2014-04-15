class ChangeColumnInOrders < ActiveRecord::Migration
  def change
  	change_column :orders, :canvas, :text
  end
end
