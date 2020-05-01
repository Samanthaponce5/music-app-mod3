class CreateSongs < ActiveRecord::Migration[6.0]
  def change
    create_table :songs do |t|
      t.string :title
      t.string :genre
      t.integer :release_year

      t.timestamps
    end
  end
end
