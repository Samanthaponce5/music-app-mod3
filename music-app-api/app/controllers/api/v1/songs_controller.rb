class Api::V1::SongsController < ApplicationController

    def index
        songs = Song.all
        render json: songs
    end

    def create
        song = Song.find_or_create_by(name: params[:name])
    end
end
