require 'spec_helper'

describe "stores/edit" do
  before(:each) do
    @store = assign(:store, stub_model(Store,
      :name => "MyString",
      :title => "MyString",
      :logo => "MyText"
    ))
  end

  it "renders the edit store form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", store_path(@store), "post" do
      assert_select "input#store_name[name=?]", "store[name]"
      assert_select "input#store_title[name=?]", "store[title]"
      assert_select "textarea#store_logo[name=?]", "store[logo]"
    end
  end
end
