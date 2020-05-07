class AddUriToFavorites < ActiveRecord::Migration[6.0]
  def change
    add_column :favorites, :uri, :string
  end
end
