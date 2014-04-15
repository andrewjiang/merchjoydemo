class CreateCarts < ActiveRecord::Migration
  def change
    create_table :carts do |t|
      t.string :user
      t.string :session
      t.float :total

      t.timestamps
    end
  end
end
