class RemoveAudioAndImageFromSongs < ActiveRecord::Migration[6.0]
  def change
    remove_column :songs, :audio
    remove_column :songs, :image
  end
end
