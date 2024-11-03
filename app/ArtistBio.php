<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ArtistBio extends Model
{
    protected $guarded = ['id'];

     protected $casts = [
         'id' => 'integer',
         'artist_id' => 'integer',
     ];
}
