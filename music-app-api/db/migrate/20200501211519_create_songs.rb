class CreateSongs < ActiveRecord::Migration[6.0]
  def change
    create_table :songs do |t|
      t.string :title
      t.string :genre
      t.string :audio
      t.string :image
      t.string :artist
      t.timestamps
    end
  end
end
