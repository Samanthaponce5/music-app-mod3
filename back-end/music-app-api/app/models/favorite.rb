class Favorite < ApplicationRecord
    belongs_to :user
    belong_to :song
end
