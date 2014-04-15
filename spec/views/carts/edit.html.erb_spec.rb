require 'spec_helper'

describe "carts/edit" do
  before(:each) do
    @cart = assign(:cart, stub_model(Cart,
      :user => "MyString",
      :session => "MyString",
      :total => 1.5
    ))
  end

  it "renders the edit cart form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", cart_path(@cart), "post" do
      assert_select "input#cart_user[name=?]", "cart[user]"
      assert_select "input#cart_session[name=?]", "cart[session]"
      assert_select "input#cart_total[name=?]", "cart[total]"
    end
  end
end
