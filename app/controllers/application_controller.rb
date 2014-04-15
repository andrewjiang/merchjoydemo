class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

	before_filter :set_cart

  def set_cart
		@session_id = request.session_options[:id]
		puts @session_id
		@cart = Cart.find_by session: @session_id
		@store = Store.find_by session: @session_id
		if @cart == nil
			puts current_user
			puts "Nil"
			if current_user.nil?
				@user =  "guest" + @session_id.to_s
				puts @user
				@cart = Cart.new(session: @session_id, user: "guest" + @session_id.to_s)
			else
				@user =  current_user.email
				@cart = Cart.new(session: @session_id, user: current_user)
			end
			@cart.save
		else
			puts @cart.session
			puts "oops"
			puts @cart.id
		end

		@cart_items = Order.where(cart: @cart.id.to_s).sum(:quantity)
		if @cart_items == 0
			@cart_items = ""
		end

  end

end
