var ffmetadata = require('ffmetadata'),
    fs = require('fs');

// Read song.mp3 metadata
ffmetadata.read('/home/julio/Música/RIPPED/Varios\ -\ Tributo\ a\ Grandes\ Poetas\ da\ Música\ Brasileira\ CD5\ -\ Lupicinio\ Rodrigues/01\ -\ Varios\ -\ Nervos\ de\ Aco_Paulinho\ da\ Viola.mp3', function(err, data) {
    if (err) console.error('Error reading metadata, err');
    else console.log(data);
});

// Set the artist for song.mp3
// ffmetadata.write('song.mp3', {
//     artist: 'Me',
// }, function(err) {
//     if (err) console.error('Error writing metadata');
//     else console.log('Data written');
// });


