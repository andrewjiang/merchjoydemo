class ChargesController < ApplicationController

	def new
	end

	def create
		@session_id = request.session_options[:id]
		puts @session_id
    puts "Thank You Again"
    
    @cart = Cart.find_by session: @session_id    
    @cart.update_attribute(:session, "PAID")

    @cart_items = ""

	end

end
