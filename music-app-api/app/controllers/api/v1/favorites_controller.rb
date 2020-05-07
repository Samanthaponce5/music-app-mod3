class Api::V1::FavoritesController < ApplicationController
    def index
        favorites = Favorite.all
        render json: favorites
    end

    def show
        favorites = Favorite.where(user_id: params[:id])
        render json: favorites
    end

    def create
        song = Song.find_or_create_by(title: params[:title], artist: params[:artist], uri: params[:uri])
        user = User.find(1)
        favorite = Favorite.create(song_id: song.id, user_id: user.id, song_name: params[:title])
        render json: favorite
    end

    def delete
        byebug
        Ravorite.destroy(params[:id])        
    end

    private
    def favorite_params
        params.require(:favorite).permit(:user_id, :song_id, :song_name)
    end
end
