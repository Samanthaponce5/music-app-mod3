class Api::V1::SongsController < ApplicationController
    def index 
        @songs = Song.all 
        render json: @songs 
    end

    def show 
        @song = Song.find(params[:id])
        render json: @song 
    end

    def create
        @song = Song.new(song_params)
        if @song.save 
            render json: @song
        else
            render error: {error: 'Unable to create User.'}, status:400
        end 
       
    end

    def update 
        @song = Song.find(params[:id])
            if @song 
                @song.update(song_params)
                render json: {message: 'User successfully updated'}, status: 200
            else
                render json: {error: 'Unable to update User'}, status:400
            end
    end

    def destroy 
        @song = Song.find(params[:id])
        if @song
            @song.destroy 
            render json: {message: 'User successfully deleted'}, status: 200
        else
            render json: {error: 'Unable to delete User'}, status: 400
        end
    end

    private

    def song_params
        params.require(:song).permit!
    end
end
