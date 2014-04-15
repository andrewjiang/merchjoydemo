require 'spec_helper'

describe "orders/show" do
  before(:each) do
    @order = assign(:order, stub_model(Order,
      :user => "User",
      :quantity => 1,
      :canvas => "Canvas",
      :model => "Model"
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/User/)
    rendered.should match(/1/)
    rendered.should match(/Canvas/)
    rendered.should match(/Model/)
  end
end
