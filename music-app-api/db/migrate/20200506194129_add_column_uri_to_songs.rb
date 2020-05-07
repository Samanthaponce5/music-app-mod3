class AddColumnUriToSongs < ActiveRecord::Migration[6.0]
  def change
    add_column :songs, :uri, :string
    add
  end
end
