class CreateStores < ActiveRecord::Migration
  def change
    create_table :stores do |t|
      t.string :name
      t.string :title
      t.text :logo

      t.timestamps
    end
  end
end
