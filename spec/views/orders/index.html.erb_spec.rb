require 'spec_helper'

describe "orders/index" do
  before(:each) do
    assign(:orders, [
      stub_model(Order,
        :user => "User",
        :quantity => 1,
        :canvas => "Canvas",
        :model => "Model"
      ),
      stub_model(Order,
        :user => "User",
        :quantity => 1,
        :canvas => "Canvas",
        :model => "Model"
      )
    ])
  end

  it "renders a list of orders" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "User".to_s, :count => 2
    assert_select "tr>td", :text => 1.to_s, :count => 2
    assert_select "tr>td", :text => "Canvas".to_s, :count => 2
    assert_select "tr>td", :text => "Model".to_s, :count => 2
  end
end
