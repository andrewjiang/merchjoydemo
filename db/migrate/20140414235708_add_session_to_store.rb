class AddSessionToStore < ActiveRecord::Migration
  def change
    add_column :stores, :session, :string
  end
end
