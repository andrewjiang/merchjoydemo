class AddOffsetToOrder < ActiveRecord::Migration
  def change
    add_column :orders, :offset, :integer
  end
end
