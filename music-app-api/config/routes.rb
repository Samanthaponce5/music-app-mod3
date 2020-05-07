Rails.application.routes.draw do
  # resources :favorites
  # resources :users
  # resources :songs



  namespace :api do 
    namespace :v1 do 
      resources :users
      resources :songs
      resources :favorites
      get '/artist', to: 'api#artist'
      get '/albums', to: 'api#albums'
      get '/tracks', to: 'api#tracks'
    end
  end

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
