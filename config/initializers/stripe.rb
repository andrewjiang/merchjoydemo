Rails.configuration.stripe = {
  :publishable_key => 'pk_test_QcvyHZ0UZEHJqCsbOtuHsGTc',
  :secret_key      => 'sk_test_LyhnMT40BZpMNdMyjpjmkwk7'
}

Stripe.api_key = Rails.configuration.stripe[:secret_key]