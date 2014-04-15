class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.string :user
      t.integer :quantity
      t.string :canvas
      t.string :model

      t.timestamps
    end
  end
end
