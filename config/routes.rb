Rails.application.routes.draw do
  root to: 'tags#index'
  get 'tags/vue_test' => 'tags#vue_test'

  resources :tags

  namespace :api, format: 'json' do
    resources :tags, only: [:index, :destroy, :update]
    post 'tags' => 'tags#create'
    post 'task/create' => 'tags#create_task'
    post 'task/clear' => 'tags#clear_tasks'
  end
end
