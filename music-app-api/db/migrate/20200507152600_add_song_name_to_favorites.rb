class AddSongNameToFavorites < ActiveRecord::Migration[6.0]
  def change
    add_column :favorites, :song_name, :string
  end
end
