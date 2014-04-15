require 'spec_helper'

describe "orders/edit" do
  before(:each) do
    @order = assign(:order, stub_model(Order,
      :user => "MyString",
      :quantity => 1,
      :canvas => "MyString",
      :model => "MyString"
    ))
  end

  it "renders the edit order form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", order_path(@order), "post" do
      assert_select "input#order_user[name=?]", "order[user]"
      assert_select "input#order_quantity[name=?]", "order[quantity]"
      assert_select "input#order_canvas[name=?]", "order[canvas]"
      assert_select "input#order_model[name=?]", "order[model]"
    end
  end
end
