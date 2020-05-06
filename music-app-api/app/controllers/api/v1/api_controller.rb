class Api::V1::ApiController < ApplicationController
    
    def artist
        # byebug
        response = HTTParty.get("https://api.spotify.com/v1/search?q=#{params[:q]}&type=artist&limit=1", {
            headers:{'accept': 'application/json',
            'content-type': 'application/json',
            'authorization': ENV['SPOTIFY_KEY']}
        })
        render json: response
    end

    def albums
        # byebug
        response = HTTParty.get("https://api.spotify.com/v1/artists/#{params[:id]}/albums?offset=0&limit=20&include_groups=album,single,compilation,appears_on", {
            headers:{'accept': 'application/json',
            'content-type': 'application/json',
            'authorization': ENV['SPOTIFY_KEY']}
        })
        render json: response
    end

    def tracks
        # byebug
        response = HTTParty.get("https://api.spotify.com/v1/albums/#{params[:id]}/tracks", {
            headers:{'accept': 'application/json',
            'content-type': 'application/json',
            'authorization': ENV['SPOTIFY_KEY']}
        })
        render json: response
    end
end
